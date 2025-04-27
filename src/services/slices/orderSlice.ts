import { orderBurgerApi, type TNewOrderResponse } from '../../utils/burger-api';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type TOrder } from '@utils-types';
import { type constructorState } from './constructorSlice';

type orderState = {
  orderRequest: boolean;
  orderIngredients: string[];
  orderData: TOrder | null;
  error: string | null;
};

const getInitialOrderState = (): orderState => ({
  orderRequest: false,
  orderIngredients: [],
  orderData: null,
  error: null
});

export const fetchOrderBurger = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      return await orderBurgerApi(ingredientIds);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: getInitialOrderState(),
  reducers: {
    createOrder: (state, { payload }: PayloadAction<constructorState>) => {
      const { bun, ingredients } = payload;
      state.orderIngredients = ingredients.map(ingredient => ingredient._id);
      
      if (bun) {
        state.orderIngredients = [bun._id, ...state.orderIngredients, bun._id];
      }
    },
    clearOrderData: (state) => {
      Object.assign(state, getInitialOrderState());
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrderBurger.fulfilled, (state, { payload }) => {
        state.orderRequest = false;
        state.orderData = payload.order;
      })
      .addCase(fetchOrderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string || 'Order creation failed';
      });
  }
});

export const { createOrder, clearOrderData } = orderSlice.actions;
export default orderSlice.reducer;
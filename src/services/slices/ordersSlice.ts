import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '../../utils/burger-api';

type ordersState = {
  feeds: TOrder[];
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
  selectedOrder: TOrder | null;
};

const initOrdersState: ordersState = {
  feeds: [],
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
  selectedOrder: null
};

export const fetchFeeds = createAsyncThunk(
  'orders/getFeeds',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/getByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: initOrdersState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка feed-запроса
      .addCase(fetchFeeds.pending, (state) => {
        state.feeds = [];
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, { payload }) => {
        state.feeds = payload.orders || [];
        state.total = payload.total;
        state.totalToday = payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, { payload }) => {
        state.error = payload as string;
      })

      // Обработка orders-запроса
      .addCase(fetchOrders.pending, (state) => {
        state.orders = [];
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, { payload }) => {
        state.orders = payload || [];
      })
      .addCase(fetchOrders.rejected, (state, { payload }) => {
        state.error = payload as string;
      })

      // Обработка запроса по номеру
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.selectedOrder = null;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, { payload }) => {
        state.selectedOrder = payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, { payload }) => {
        state.error = payload as string;
      });
  }
});

export default ordersSlice.reducer;
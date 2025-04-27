import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

type ingredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const getInitialState = (): ingredientsState => ({
  ingredients: [],
  isLoading: false,
  error: null
});

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    try {
      return await getIngredientsApi();
    } catch (error) {
      throw new Error('Failed to fetch ingredients');
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.ingredients = payload || [];
      })
      .addCase(fetchIngredients.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message || 'Unknown error occurred';
      });
  }
});

export default ingredientsSlice.reducer;
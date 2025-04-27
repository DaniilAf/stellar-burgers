import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type TConstructorIngredient } from '@utils-types';

export type constructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const getInitialState = (): constructorState => ({
  bun: null,
  ingredients: []
});

const reorderItems = (
  items: TConstructorIngredient[],
  itemId: string,
  offset: number
): TConstructorIngredient[] => {
  const result = [...items];
  const fromIndex = result.findIndex(({ id }) => id === itemId);
  const toIndex = fromIndex + offset;

  if (toIndex >= 0 && toIndex < result.length) {
    [result[fromIndex], result[toIndex]] = [result[toIndex], result[fromIndex]];
  }

  return result;
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState: getInitialState(),
  reducers: {
    addIngredient: {
      reducer(state, { payload }: PayloadAction<TConstructorIngredient>) {
        payload.type === 'bun' 
          ? (state.bun = payload) 
          : state.ingredients.push(payload);
      },
      prepare(payload: TConstructorIngredient) {
        return { payload };
      }
    },

    deleteIngredient: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
      state.ingredients = state.ingredients.filter(
        ({ id }) => id !== payload.id
      );
    },

    clearConstructorData: (state) => {
      Object.assign(state, getInitialState());
    },

    moveIngredient: {
      reducer(state, { payload: { item, direction } }: PayloadAction<{
        item: TConstructorIngredient;
        direction: 'up' | 'down';
      }>) {
        state.ingredients = reorderItems(
          state.ingredients,
          item.id,
          direction === 'up' ? -1 : 1
        );
      },
      prepare(item: TConstructorIngredient, direction: 'up' | 'down') {
        return { payload: { item, direction } };
      }
    }
  }
});

export const {
  addIngredient,
  deleteIngredient,
  clearConstructorData,
  moveIngredient: moveIngredientUp,
  moveIngredient: moveIngredientDown
} = constructorSlice.actions;

export default constructorSlice.reducer;
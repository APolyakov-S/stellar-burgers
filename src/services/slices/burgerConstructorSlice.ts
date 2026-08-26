import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление ингредиента
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    // Удаление ингредиента
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    // Перемещение вверх
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const item = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index - 1];
        state.ingredients[index - 1] = item;
      }
    },
    // Перемещение вниз
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        const item = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index + 1];
        state.ingredients[index + 1] = item;
      }
    },
    // Очистка конструктора
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;

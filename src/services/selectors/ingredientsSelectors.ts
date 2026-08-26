import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectIngredientsState = (state: RootState) => state.ingredients;

export const selectIngredients = createSelector(
  [selectIngredientsState],
  (ingredientsState) => ingredientsState.ingredients
);

export const selectIngredientsLoading = createSelector(
  [selectIngredientsState],
  (ingredientsState) => ingredientsState.isLoading
);

export const selectIngredientsError = createSelector(
  [selectIngredientsState],
  (ingredientsState) => ingredientsState.error
);

// Селектор для получения ингредиента по id
export const selectIngredientById = (id: string) =>
  createSelector([selectIngredients], (ingredients) =>
    ingredients.find((ingredient) => ingredient._id === id)
  );

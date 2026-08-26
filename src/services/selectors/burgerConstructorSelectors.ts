import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectConstructorState = (state: RootState) =>
  state.burgerConstructor;

export const selectConstructorItems = createSelector(
  [selectConstructorState],
  (constructorState) => ({
    bun: constructorState.bun,
    ingredients: constructorState.ingredients
  })
);

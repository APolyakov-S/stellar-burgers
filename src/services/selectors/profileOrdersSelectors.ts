import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectProfileOrdersState = (state: RootState) =>
  state.profileOrders;

export const selectProfileOrders = createSelector(
  [selectProfileOrdersState],
  (profileOrdersState) => profileOrdersState.orders
);

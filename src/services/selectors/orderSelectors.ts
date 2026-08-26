import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectOrderState = (state: RootState) => state.order;

export const selectOrderRequest = createSelector(
  [selectOrderState],
  (orderState) => orderState.orderRequest
);

export const selectOrderModalData = createSelector(
  [selectOrderState],
  (orderState) => orderState.orderModalData
);

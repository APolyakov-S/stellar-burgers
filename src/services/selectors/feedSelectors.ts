import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectFeedState = (state: RootState) => state.feed;

export const selectFeedOrders = createSelector(
  [selectFeedState],
  (feedState) => feedState.orders
);

export const selectFeedTotal = createSelector(
  [selectFeedState],
  (feedState) => feedState.total
);

export const selectFeedTotalToday = createSelector(
  [selectFeedState],
  (feedState) => feedState.totalToday
);

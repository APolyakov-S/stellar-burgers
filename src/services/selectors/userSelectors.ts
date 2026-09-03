import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectUser = (state: RootState) => state.user;

export const selectUserData = createSelector([selectUser], (user) => user.user);

export const selectUserIsAuthChecked = createSelector(
  [selectUser],
  (user) => user.isAuthChecked
);

export const selectUserError = createSelector(
  [selectUser],
  (user) => user.error
);

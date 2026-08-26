import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  error: null
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', getFeedsApi);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeed: (state, action: { payload: TOrder[] }) => {
      state.orders = action.payload;
    },
    setFeedTotal: (
      state,
      action: { payload: { total: number; totalToday: number } }
    ) => {
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    clearFeed: (state) => {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка загрузки ленты';
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const { setFeed, setFeedTotal, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;

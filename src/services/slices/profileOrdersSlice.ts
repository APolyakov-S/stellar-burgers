import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

export type TProfileOrdersState = {
  orders: TOrder[];
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetchProfileOrders',
  getOrdersApi
);

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    setProfileOrders: (state, action: { payload: TOrder[] }) => {
      state.orders = action.payload;
    },
    clearProfileOrders: (state) => {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка загрузки истории заказов';
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  }
});

export const { setProfileOrders, clearProfileOrders } =
  profileOrdersSlice.actions;
export default profileOrdersSlice.reducer;

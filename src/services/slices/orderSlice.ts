import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

export type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order as TOrder;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      });
  }
});

export const { closeOrderModal } = orderSlice.actions;
export default orderSlice.reducer;

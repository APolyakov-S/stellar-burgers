import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

export type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderByNumber: TOrder | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderByNumber: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order as TOrder;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0] as TOrder;
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
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка загрузки заказа';
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumber = action.payload;
      });
  }
});

export const { closeOrderModal } = orderSlice.actions;
export default orderSlice.reducer;

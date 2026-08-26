import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import feedReducer from './slices/feedSlice';
import orderReducer from './slices/orderSlice';
import profileOrdersReducer from './slices/profileOrdersSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = {
  user: userReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  order: orderReducer,
  profileOrders: profileOrdersReducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

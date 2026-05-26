import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import favouritesReducer from './favouritesSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: { cart: cartReducer, favourites: favouritesReducer, auth: authReducer },
});

export type RootState  = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

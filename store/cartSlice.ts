'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id:        string;
  name:      string;
  te:        string;
  emoji:     string | null;
  image_url: string | null;
  price:     number;
  unit:      string;
  quantity:  number;
}

interface CartState { items: CartItem[] }
const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) { existing.quantity += action.payload.quantity; }
      else { state.items.push({ ...action.payload }); }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    increaseQty(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQty(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.id === action.payload);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) state.items = state.items.filter(i => i.id !== action.payload);
      }
    },
    clearCart(state) { state.items = []; },
  },
});

export const { addToCart, removeFromCart, increaseQty, decreaseQty, clearCart } = cartSlice.actions;
export const selectCartItems = (s: { cart: CartState }) => s.cart.items;
export const selectCartCount = (s: { cart: CartState }) => s.cart.items.reduce((a, i) => a + i.quantity, 0);
export const selectCartTotal = (s: { cart: CartState }) => s.cart.items.reduce((a, i) => a + i.price * i.quantity, 0);
export const selectItemQty   = (id: string) => (s: { cart: CartState }) => s.cart.items.find(i => i.id === id)?.quantity ?? 0;
export default cartSlice.reducer;

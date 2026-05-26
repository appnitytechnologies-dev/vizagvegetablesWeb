'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  id:         string;
  phone:      string;
  name:       string;
  token:      string;
}

const initialState: AuthState = { isLoggedIn: false, id: '', phone: '', name: '', token: '' };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; id: string; phone: string; name: string }>) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.id    = action.payload.id;
      state.phone = action.payload.phone;
      state.name  = action.payload.name;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.id    = '';
      state.phone = '';
      state.name  = '';
      state.token = '';
    },
    updateUserName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
  },
});

export const { loginSuccess, logout, updateUserName } = authSlice.actions;
export const selectAuth = (s: { auth: AuthState }) => s.auth;
export default authSlice.reducer;

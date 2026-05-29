'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavState { ids: string[] }
const initialState: FavState = { ids: [] };

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    toggleFavourite(state, action: PayloadAction<string>) {
      const idx = state.ids.indexOf(action.payload);
      if (idx >= 0) state.ids.splice(idx, 1);
      else state.ids.push(action.payload);
    },
    setFavourites(state, action: PayloadAction<string[]>) {
      state.ids = action.payload;
    },
    clearFavourites(state) {
      state.ids = [];
    },
  },
});

export const { toggleFavourite, setFavourites, clearFavourites } = favouritesSlice.actions;
export const selectFavouriteIds = (s: { favourites: FavState }) => s.favourites.ids;
export const selectIsFavourite  = (id: string) => (s: { favourites: FavState }) => s.favourites.ids.includes(id);
export default favouritesSlice.reducer;

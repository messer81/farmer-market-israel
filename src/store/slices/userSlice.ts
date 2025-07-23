import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UserState {
  user: User | null;
  token: string | null;
}

const initialState: UserState = {
  user: null, // null = guest
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
    loginAsGuest: (state) => {
      state.user = {
        id: 'guest',
        name: 'Guest', // Будет переведено в компонентах
        email: '',
        phone: '',
        address: '',
        preferredLanguage: 'ru',
        isGuest: true
      };
      state.token = null;
    },
  },
});

export const { setUser, clearUser, setToken, clearToken, loginAsGuest } = userSlice.actions;
export default userSlice.reducer; 
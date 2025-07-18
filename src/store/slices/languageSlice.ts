import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'ru' | 'en' | 'he';

interface LanguageState {
  currentLanguage: Language;
}

const initialState: LanguageState = {
  currentLanguage: 'ru',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLanguage = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer; 
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // adapte ce chemin

const store = configureStore({
  reducer: {
    auth: authReducer,
    // ajoute d'autres slices ici
  },
});

export default store;

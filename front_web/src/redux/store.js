import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // adapte ce chemin
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    // ajoute d'autres slices ici
  },
});

export default store;

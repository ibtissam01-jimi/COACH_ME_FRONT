import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // adapte ce chemin

import ressourceReducer from './slices/ressourceSlice';
import planReducer from './slices/planSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ressources: ressourceReducer,
     plans: planReducer,
  },
});

export default store;

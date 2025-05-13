import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // adapte ce chemin
import categoryReducer from './slices/categorieSlice';
import ressourceReducer from './slices/ressourceSlice';
import planReducer from './slices/planSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ressources: ressourceReducer,
    plans: planReducer,
    categories: categoryReducer,
  },
});

export default store;

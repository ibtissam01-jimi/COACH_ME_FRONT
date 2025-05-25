import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorieSlice';
import ressourceReducer from './slices/ressourceSlice';
import planReducer from './slices/planSlice';
import abonnementsReducer from './slices/abonnementsSlice';
import coachReducer from './slices/coachSlice';
import paiementReducer from './slices/paiementsSlice';
import userReducer from './slices/userSlice';
import feedbackReducer from './slices/feedbackSlice';
import objectifReducer from './slices/objectifSlice';
import sousObjectifReducer from './slices/sousObjectifSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ressources: ressourceReducer,
    plans: planReducer,
    categories: categoryReducer,
    abonnements: abonnementsReducer,
    coachs: coachReducer,
    paiement: paiementReducer,
    users: userReducer,
    feedback: feedbackReducer,
    objectifs: objectifReducer,
    sousObjectifs:sousObjectifReducer
  },
});

export default store;

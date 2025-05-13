
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';  // Importation de l'instance axios

// Thunks pour effectuer des appels API
export const fetchRessources = createAsyncThunk('ressources/fetchAll', async () => {
  const response = await api.get('/ressources');  // Appel à l'API pour récupérer les ressources
  return response.data;
});

export const getRessource = createAsyncThunk('ressources/getOne', async (id) => {
  const response = await api.get(`/ressources/${id}`);  // Appel pour récupérer une ressource spécifique
  return response.data;
});

export const createRessource = createAsyncThunk('ressources/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/ressources', data);  // Appel pour créer une nouvelle ressource
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);  // En cas d'erreur, on renvoie l'erreur
  }
});

export const updateRessource = createAsyncThunk('ressources/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/ressources/${id}`, data);  // Appel pour mettre à jour une ressource existante
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);  // Gestion des erreurs
  }
});

export const deleteRessources = createAsyncThunk('ressources/delete', async (ids, { rejectWithValue }) => {
  try {
    const response = await api.delete('/ressources', { data: { ids } });  // Suppression de ressources
    return { ids, message: response.data.message };
  } catch (err) {
    return rejectWithValue(err.response.data);  // En cas d'erreur
  }
});

// Slice des ressources
const ressourceSlice = createSlice({
  name: 'ressources',
  initialState: {
    ressources: [],
    selected: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearMessage(state) {
      state.message = null;  // Efface les messages
    },
    clearError(state) {
      state.error = null;  // Efface les erreurs
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRessources.pending, (state) => {
        state.loading = true;  // En attente de la réponse
      })
      .addCase(fetchRessources.fulfilled, (state, action) => {
        state.loading = false;
        state.ressources = action.payload;  // Met à jour les ressources
      })
      .addCase(fetchRessources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;  // Gère l'erreur
      })

      // Pour chaque autre action (get, create, update, delete), gérer les états similaires

      .addCase(getRessource.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createRessource.fulfilled, (state, action) => {
        state.ressources.push(action.payload);  // Ajoute la ressource créée
        state.message = action.payload.message;
      })
      .addCase(updateRessource.fulfilled, (state, action) => {
        const index = state.ressources.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.ressources[index] = action.payload;
        }
        state.message = action.payload.message;
      })
      .addCase(deleteRessources.fulfilled, (state, action) => {
        state.ressources = state.ressources.filter(r => !action.payload.ids.includes(r.id));
        state.message = action.payload.message;
      });
  }
});

export const { clearMessage, clearError } = ressourceSlice.actions;
export default ressourceSlice.reducer;


// src/redux/slices/abonnementsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api'; // assure-toi que le chemin est correct

// --- Thunks ---

// 📥 Récupérer tous les abonnements
export const fetchAbonnements = createAsyncThunk('abonnements/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/abonnements');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// 📥 Récupérer un abonnement par ID
export const fetchAbonnement = createAsyncThunk('abonnements/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/abonnements/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ➕ Créer un abonnement
export const createAbonnement = createAsyncThunk('abonnements/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/abonnements', data);
    return response.data.abonnement;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ✏️ Mettre à jour un abonnement
export const updateAbonnement = createAsyncThunk('abonnements/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/abonnements/${id}`, data);
    return response.data.abonnement;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ❌ Supprimer un abonnement
export const deleteAbonnement = createAsyncThunk('abonnements/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/abonnements/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// --- Slice ---
const abonnementsSlice = createSlice({
  name: 'abonnements',
  initialState: {
    abonnements: [],
    selectedAbonnement: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedAbonnement: (state) => {
      state.selectedAbonnement = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ---- fetchAll ----
      .addCase(fetchAbonnements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAbonnements.fulfilled, (state, action) => {
        state.loading = false;
        state.abonnements = action.payload;
      })
      .addCase(fetchAbonnements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---- fetchOne ----
      .addCase(fetchAbonnement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAbonnement.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAbonnement = action.payload;
      })
      .addCase(fetchAbonnement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---- create ----
      .addCase(createAbonnement.pending, (state) => {
        state.error = null;
      })
      .addCase(createAbonnement.fulfilled, (state, action) => {
        state.abonnements.push(action.payload);
      })
      .addCase(createAbonnement.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ---- update ----
      .addCase(updateAbonnement.fulfilled, (state, action) => {
        const index = state.abonnements.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.abonnements[index] = action.payload;
        }
      })
      .addCase(updateAbonnement.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ---- delete ----
      .addCase(deleteAbonnement.fulfilled, (state, action) => {
        state.abonnements = state.abonnements.filter(a => a.id !== action.payload);
      })
      .addCase(deleteAbonnement.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// --- Export ---
export const { clearSelectedAbonnement } = abonnementsSlice.actions;
export default abonnementsSlice.reducer;

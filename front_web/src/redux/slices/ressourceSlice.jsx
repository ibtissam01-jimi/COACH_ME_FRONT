import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Thunks

export const fetchRessources = createAsyncThunk('ressources/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/ressources');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const getRessource = createAsyncThunk('ressources/getOne', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/ressources/${id}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createRessource = createAsyncThunk('ressources/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/ressources', data);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateRessource = createAsyncThunk('ressources/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/ressources/${id}`, data);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteRessources = createAsyncThunk('ressources/delete', async (ids, { rejectWithValue }) => {
  try {
    const response = await api.delete('/ressources', { data: { ids } });
    return { ids, message: response.data.message || "Suppression réussie" };
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// Slice

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
      state.message = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchRessources.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchRessources.fulfilled, (state, action) => {
        state.loading = false;
        state.ressources = action.payload;
      })
      .addCase(fetchRessources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Get one
      .addCase(getRessource.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(getRessource.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(getRessource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Create
      .addCase(createRessource.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(createRessource.fulfilled, (state, action) => {
        state.loading = false;
        state.ressources.push(action.payload);
        state.message = action.payload.message || "Ressource créée avec succès";
      })
      .addCase(createRessource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Update
      .addCase(updateRessource.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateRessource.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.ressources.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.ressources[index] = action.payload;
        }
        state.message = action.payload.message || "Ressource mise à jour";
      })
      .addCase(updateRessource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Delete
      .addCase(deleteRessources.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteRessources.fulfilled, (state, action) => {
        state.loading = false;
        state.ressources = state.ressources.filter(r => !action.payload.ids.includes(r.id));
        state.message = action.payload.message || "Ressources supprimées";
      })
      .addCase(deleteRessources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { clearMessage, clearError } = ressourceSlice.actions;
export default ressourceSlice.reducer;



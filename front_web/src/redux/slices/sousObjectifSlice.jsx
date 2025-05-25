// src/redux/slices/sousObjectifSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Récupérer les sous-objectifs (optionnel: par objectifId)
export const fetchSousObjectifs = createAsyncThunk(
  'sousObjectifs/fetchAll',
  async (objectif_id, { rejectWithValue }) => {
    try {
      // On ajoute le paramètre objectif_id dans la query string
      const res = await api.get('/sous-objectifs', {
        params: { objectif_id }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Ajouter un sous-objectif
export const addSousObjectif = createAsyncThunk(
  'sousObjectifs/add',
  async (newSubObj, { rejectWithValue }) => {
    try {
      const res = await api.post('/sous-objectifs', newSubObj);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Supprimer un sous-objectif
export const deleteSousObjectif = createAsyncThunk(
  'sousObjectifs/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/sous-objectifs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Modifier un sous-objectif
export const updateSousObjectif = createAsyncThunk(
  'sousObjectifs/update',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/sous-objectifs/${id}`, updatedData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const sousObjectifSlice = createSlice({
  name: 'sousObjectifs',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSousObjectifs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSousObjectifs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchSousObjectifs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addSousObjectif.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(deleteSousObjectif.fulfilled, (state, action) => {
        state.data = state.data.filter(sub => sub.id !== action.payload);
      })
      .addCase(updateSousObjectif.fulfilled, (state, action) => {
        const index = state.data.findIndex(sub => sub.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      });
  },
});

export default sousObjectifSlice.reducer;

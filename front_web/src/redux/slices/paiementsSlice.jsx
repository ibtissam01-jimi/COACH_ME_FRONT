
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
import api from '../api';

// Récupérer tous les paiements
export const fetchPaiements = createAsyncThunk('paiements/fetch', async (_, thunkAPI) => {
  try {
    const response = await api.get('/paiements');
    return response.data;  // On suppose que l'API renvoie la liste directement ici
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Récupérer un paiement par ID
export const fetchPaiementById = createAsyncThunk('paiements/fetchById', async (id, thunkAPI) => {
  try {
    const response = await api.get(`/paiements/${id}`);
    return response.data; // Assure-toi que l'API renvoie bien un objet paiement ici
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Ajouter un nouveau paiement
export const addPaiement = createAsyncThunk('paiements/add', async (paiementData, thunkAPI) => {
  try {
    const response = await api.post('/paiements', paiementData);
    return response.data.paiement; // Assure-toi que l'API renvoie { paiement: {...} }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});


export const updatePaiement = createAsyncThunk('paiements/update', async ({ id, ...data }, thunkAPI) => {
  try {
    const response = await api.put(`/paiements/${id}`, data);
    // Supposons que la réponse est l'objet paiement lui-même
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Supprimer un paiement
export const deletePaiement = createAsyncThunk('paiements/delete', async (id, thunkAPI) => {
  try {
    await api.delete(`/paiements/${id}`);
    return id;  // Retourner l'id supprimé pour mise à jour du state
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Slice
const paiementSlice = createSlice({
  name: 'paiements',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch paiements
      .addCase(fetchPaiements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaiements.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPaiements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch by id (optionnel: ici on ne modifie pas le state global)
      .addCase(fetchPaiementById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaiementById.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchPaiementById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // add
      .addCase(addPaiement.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addPaiement.rejected, (state, action) => {
        state.error = action.payload;
      })

      // update
      .addCase(updatePaiement.fulfilled, (state, action) => {
  if (!action.payload || !action.payload.id) return;
  const index = state.items.findIndex(p => p.id === action.payload.id);
  if (index !== -1) {
    state.items[index] = action.payload;
  }
})
      .addCase(updatePaiement.rejected, (state, action) => {
        state.error = action.payload;
      })

      // delete
      .addCase(deletePaiement.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      })
      .addCase(deletePaiement.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default paiementSlice.reducer;



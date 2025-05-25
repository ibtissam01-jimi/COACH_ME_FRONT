import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Fetch tous les objectifs
export const fetchObjectifs = createAsyncThunk(
  'objectifs/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/objectifs');
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Ajouter un objectif
export const addObjectif = createAsyncThunk(
  'objectifs/add',
  async (newObj, { rejectWithValue }) => {
    try {
      const res = await api.post('/objectifs', newObj);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Supprimer un objectif
export const deleteObjectif = createAsyncThunk(
  'objectifs/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/objectifs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Modifier un objectif
export const updateObjectif = createAsyncThunk(
  'objectifs/update',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/objectifs/${id}`, updatedData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const objectifSlice = createSlice({
  name: 'objectifs',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchObjectifs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchObjectifs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchObjectifs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addObjectif.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(deleteObjectif.fulfilled, (state, action) => {
        state.data = state.data.filter(obj => obj.id !== action.payload);
      })
      .addCase(updateObjectif.fulfilled, (state, action) => {
        const index = state.data.findIndex(obj => obj.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      });
  },
});

export default objectifSlice.reducer;

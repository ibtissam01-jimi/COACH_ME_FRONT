// src/redux/slices/coachSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchCoachs = createAsyncThunk(
  'coach/fetchCoachs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/coachs');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des coachs');
    }
  }
);

const coachSlice = createSlice({
  name: 'coach',
  initialState: {
    coachs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoachs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoachs.fulfilled, (state, action) => {
        state.coachs = action.payload;
        state.loading = false;
      })
      .addCase(fetchCoachs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default coachSlice.reducer;

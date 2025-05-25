
// src/redux/feedbackSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchFeedbacks = createAsyncThunk(
  'feedback/fetchFeedbacks',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/feedback');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Erreur lors du chargement');
    }
  }
);

export const createFeedback = createAsyncThunk(
  'feedback/createFeedback',
  async (feedbackData, thunkAPI) => {
    try {
      const response = await api.post('/feedback', feedbackData);
      return response.data.feedback;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Erreur lors de la création');
    }
  }
);

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    feedbacks: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearFeedbackMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks.push(action.payload);
        state.successMessage = 'Feedback créé avec succès';
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFeedbackMessages } = feedbackSlice.actions;
export default feedbackSlice.reducer;

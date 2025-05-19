import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';  

const initialState = {
  user: null,
  token: null,
  roles: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await api.post('/register', userData);  
    return response.data;  
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Erreur d'inscription");
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await api.post('/login', credentials);  
    return response.data;  
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Erreur de connexion');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState().auth;
    await api.post('/logout', {}, {
      headers: { Authorization: `Bearer ${state.token}` }  
    });
    return null;  
  } catch (error) {
    return thunkAPI.rejectWithValue('Erreur lors de la déconnexion');
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState().auth;
    if (!state.token) {
      throw new Error('Aucun utilisateur connecté');
    }

    const response = await api.get('/me', {
      headers: { Authorization: `Bearer ${state.token}` }  
    });

    return {
      user: response.data,
      access_token: state.token,
      roles: state.roles || []
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Impossible de récupérer les infos utilisateur');
  }
});

// ... rest of the slice code remains the same ...
// Slice Redux pour l'authentification
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.roles = action.payload.roles;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.roles = action.payload.roles;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
        state.token = null;
        state.roles = [];
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.roles = action.payload.roles;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
        state.roles = [];
      });
  }
});

export const { resetState } = authSlice.actions;

export default authSlice.reducer;
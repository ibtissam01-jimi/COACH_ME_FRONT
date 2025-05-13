import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api'; // axios instance

const initialState = {
  user: null,
  token: null,
  roles: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// REGISTER
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const res = await api.post('/register', userData);
    localStorage.setItem('user', JSON.stringify(res.data));  // Stocke les données utilisateur dans localStorage
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Erreur lors de l’inscription');
  }
});

// LOGIN
export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await api.post('/login', credentials);
    console.log('Login response:', res.data); // Log la réponse pour vérifier le token
    localStorage.setItem('user', JSON.stringify(res.data)); // Sauvegarde des données utilisateur dans localStorage
    return res.data;  // Retourne les données du token et utilisateur
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Erreur lors de la connexion');
  }
});

// LOGOUT
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState().auth;
    await api.post('/logout', {}, {
      headers: {
        Authorization: `Bearer ${state.token}`  // Envoi du token dans les headers de la requête
      }
    });
    localStorage.removeItem('user');  // Supprime les données utilisateur de localStorage
    return null;
  } catch (err) {
    return thunkAPI.rejectWithValue('Erreur lors de la déconnexion');
  }
});

// FETCH USER (me)
export const fetchMe = createAsyncThunk('auth/me', async (_, thunkAPI) => {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) throw new Error('Utilisateur non trouvé');

    const parsed = JSON.parse(storedUser);
    const token = parsed.access_token;
    if (!token) throw new Error('Token manquant');

    const res = await api.get('/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      user: res.data,
      access_token: token,
      roles: parsed.roles || []
    };
  } catch (err) {
    localStorage.removeItem('user');
    return thunkAPI.rejectWithValue(err.message || 'Impossible de récupérer les informations');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
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

      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;  // Définit correctement le token dans l'état
        state.roles = action.payload.roles;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // LOGOUT
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

      // FETCH USER (me)
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;  // Définit correctement le token dans l'état
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

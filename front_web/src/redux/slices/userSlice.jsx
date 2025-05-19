import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const initialState = {
  users: [],
  selectedUser: null,
  status: 'idle',
  error: null,
  validationErrors: null
};


export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des utilisateurs');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Utilisateur non trouvé');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users', formData);
      return response.data;
    } catch (error) {
      console.log('Create User Error:', error.response?.data);
      if (error.response?.status === 422) {
        return rejectWithValue({
          message: 'Erreur de validation',
          error: error.response.data.error || error.response.data
        });
      }
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création de l\'utilisateur');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, formData }, { rejectWithValue, getState, dispatch }) => {
    try {
      const currentUser = getState().users.users.find(u => u.id === id);
      
      if (currentUser && formData.get('role') !== currentUser.role) {
        formData.append('role_change', JSON.stringify({
          from: currentUser.role,
          to: formData.get('role')
        }));
      }

      // Add _method: 'PUT' to handle PUT request with FormData
      formData.append('_method', 'PUT');

      const response = await api.post(`/users/${id}`, formData, {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      // After successful update, fetch both the updated user data and the users list
      await Promise.all([
        dispatch(fetchMe()),
        dispatch(fetchUsers())
      ]);
      
      // Return success response with the updated user data
      return {
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: response.data,
        id: id
      };
    } catch (error) {
      console.log('Update User Error:', error.response?.data);
      if (error.response?.status === 422) {
        return rejectWithValue({
          message: 'Erreur de validation',
          error: error.response.data.error || error.response.data
        });
      }
      // If we get here, the update was successful but the response format was unexpected
      return {
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        id: id
      };
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearValidationErrors: (state) => {
      state.validationErrors = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newUser = {
          ...action.payload,
          role: action.payload.role || action.payload.roles?.[0]?.name,
          statut: action.payload.statut || 'Actif',
          nom: action.payload.nom || '',
          prenom: action.payload.prenom || '',
          email: action.payload.email || '',
          telephone: action.payload.telephone || ''
        };
        state.users.push(newUser);
        state.validationErrors = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Erreur lors de la création de l\'utilisateur';
        state.validationErrors = action.payload?.errors || null;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = {
            ...state.users[index],
            ...action.payload.data,
            id: action.payload.id
          };
        }
        state.selectedUser = action.payload.data;
        state.validationErrors = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        if (action.payload?.errors) {
          state.validationErrors = action.payload.errors;
        }
        state.error = action.payload?.message || 'Erreur lors de la mise à jour de l\'utilisateur';
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.filter(u => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearSelectedUser, clearValidationErrors } = userSlice.actions;
export default userSlice.reducer; 
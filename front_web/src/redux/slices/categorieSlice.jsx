

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// 📥 GET all categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/categories');
      return response.data; // Retourne la liste des catégories
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ➕ POST create one or many categories
export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, thunkAPI) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data.categories;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 📝 PUT update a category
export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`/categories/${id}`, data);
      return response.data.categorie;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ❌ DELETE one or multiple categories
export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async ({ id, ids }, thunkAPI) => {
    try {
      if (ids && ids.length > 0) {
        const response = await api.delete('/categories', { data: { ids } });
        return { deleted: ids };
      } else if (id) {
        const response = await api.delete(`/categories/${id}`);
        return { deleted: [id] };
      } else {
        throw new Error("Aucun ID fourni pour la suppression.");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [], // Liste des catégories
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // Mettez à jour `items`
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ Create
      .addCase(createCategory.fulfilled, (state, action) => {
        const created = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
        state.items.push(...created);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 📝 Update
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((cat) => cat.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ❌ Delete
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(cat => !action.payload.deleted.includes(cat.id));
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;


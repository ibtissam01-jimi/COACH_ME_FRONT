// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../api';

// // 🎯 GET all paiements
// export const fetchPaiements = createAsyncThunk('paiements/fetch', async (_, thunkAPI) => {
//   try {
//     const response = await api.get('/paiements');
//     return response.data;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response?.data || error.message);
//   }
// });

// // ➕ POST: add paiement
// export const addPaiement = createAsyncThunk('paiements/add', async (paiementData, thunkAPI) => {
//   try {
//     const response = await api.post('/paiements', paiementData);
//     return response.data.paiement;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response?.data || error.message);
//   }
// });

// // 🛠️ PUT: update paiement statut
// export const updatePaiement = createAsyncThunk('paiements/update', async ({ id, statut }, thunkAPI) => {
//   try {
//     const response = await api.put(`/paiements/${id}`, { statut });
//     return response.data.paiement;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response?.data || error.message);
//   }
// });

// // ❌ DELETE paiement
// export const deletePaiement = createAsyncThunk('paiements/delete', async (id, thunkAPI) => {
//   try {
//     await api.delete(`/paiements/${id}`);
//     return id;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response?.data || error.message);
//   }
// });

// const paiementSlice = createSlice({
//   name: 'paiements',
//   initialState: {
//     items: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},

//   extraReducers: (builder) => {
//     builder
//       // fetch
//       .addCase(fetchPaiements.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPaiements.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchPaiements.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // add
//       .addCase(addPaiement.fulfilled, (state, action) => {
//         state.items.push(action.payload);
//       })
//       .addCase(addPaiement.rejected, (state, action) => {
//         state.error = action.payload;
//       })

//       // update
//       .addCase(updatePaiement.fulfilled, (state, action) => {
//         const index = state.items.findIndex(p => p.id === action.payload.id);
//         if (index !== -1) {
//           state.items[index] = action.payload;
//         }
//       })
//       .addCase(updatePaiement.rejected, (state, action) => {
//         state.error = action.payload;
//       })

//       // delete
//       .addCase(deletePaiement.fulfilled, (state, action) => {
//         state.items = state.items.filter(p => p.id !== action.payload);
//       })
//       .addCase(deletePaiement.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   }
// });

// export default paiementSlice.reducer;







import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Export directement à la déclaration
export const fetchPaiements = createAsyncThunk('paiements/fetch', async (_, thunkAPI) => {
  try {
    const response = await api.get('/paiements');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchPaiementById = createAsyncThunk('paiements/fetchById', async (id, thunkAPI) => {
  try {
    const response = await api.get(`/paiements/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const addPaiement = createAsyncThunk('paiements/add', async (paiementData, thunkAPI) => {
  try {
    const response = await api.post('/paiements', paiementData);
    return response.data.paiement;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const updatePaiement = createAsyncThunk('paiements/update', async ({ id, statut }, thunkAPI) => {
  try {
    const response = await api.put(`/paiements/${id}`, { statut });
    return response.data.paiement;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const deletePaiement = createAsyncThunk('paiements/delete', async (id, thunkAPI) => {
  try {
    await api.delete(`/paiements/${id}`);
    return id;
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

      // fetch by id
      .addCase(fetchPaiementById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaiementById.fulfilled, (state, action) => {
        state.loading = false;
        // Optionnel : gérer stockage d'un paiement unique
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


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api'; // Utilise l'instance Axios avec token

const API_URL = '/plans';

// 🔄 Get all plans
export const fetchPlans = createAsyncThunk('plans/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 🔄 Get one plan
export const fetchPlanById = createAsyncThunk('plans/fetchById', async (id, thunkAPI) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// ➕ Create plan(s)
export const createPlans = createAsyncThunk('plans/create', async (plans, thunkAPI) => {
  try {
    const response = await api.post(API_URL, plans);
    return response.data.plans;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// ✏️ Update plan
export const updatePlan = createAsyncThunk('plans/update', async ({ id, data }, thunkAPI) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, data);
    return response.data.plan;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deletePlans = createAsyncThunk('plans/delete', async ({ id, ids }, thunkAPI) => {
  try {
    let response;
    if (ids && ids.length > 0) {
      // Supprimer plusieurs plans
      response = await api.delete(`/plans`, { data: { ids } });
    } else if (id) {
      // Supprimer un seul plan
      response = await api.delete(`plans/${id}`);
    }
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});


const planSlice = createSlice({
  name: 'plans',
  initialState: {
    plans: [],
    selectedPlan: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedPlan: (state) => {
      state.selectedPlan = null;
    },
    selectPlan: (state, action) => {
      const { id, select } = action.payload;
      const plan = state.plans.find(plan => plan.id === id);
      if (plan) plan.isSelected = select;
    },
    selectAll: (state, action) => {
      const select = action.payload.select;
      state.plans.forEach(plan => {
        plan.isSelected = select;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 FETCH ALL
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 FETCH ONE
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.selectedPlan = action.payload;
      })

      // ➕ CREATE
      .addCase(createPlans.fulfilled, (state, action) => {
        state.plans.push(...action.payload);
      })

      // ✏️ UPDATE
      .addCase(updatePlan.fulfilled, (state, action) => {
        const index = state.plans.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
      })

      // ❌ DELETE
      .addCase(deletePlans.fulfilled, (state, action) => {
        const deletedIds = action.meta.arg.ids || [action.meta.arg.id];
        state.plans = state.plans.filter(p => !deletedIds.includes(p.id));
      });
  },
});

export const { selectPlan, selectAll, clearSelectedPlan } = planSlice.actions;
export default planSlice.reducer;


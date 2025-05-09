import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initial State
const initialState = {
  user: null,
  token: null,
  roles: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// ✅ Register User
export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
  try {
    const response = await api.post("/register", userData);
    const { access_token, user, roles } = response.data;

    // Stocker le token dans AsyncStorage
    await AsyncStorage.setItem("user", JSON.stringify({ access_token, user, roles }));

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Erreur d'inscription");
  }
});

// ✅ Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await api.post("/login", { email, password });
      const { access_token, user } = response.data;

      await AsyncStorage.setItem("user", JSON.stringify({ access_token, user }));

      return { user, access_token };
    } catch (err) {
      return thunkAPI.rejectWithValue("Erreur de connexion");
    }
  }
);

// ✅ Logout User
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState().auth;
    const token = state.token;

    await api.post("/logout", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await AsyncStorage.removeItem("user");

    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue("Erreur lors de la déconnexion");
  }
});

// ✅ Fetch User Info
export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, thunkAPI) => {
  try {
    const storedUser = await AsyncStorage.getItem("user");

    if (!storedUser) {
      throw new Error("Utilisateur non connecté");
    }

    const { access_token, roles } = JSON.parse(storedUser);

    const response = await api.get("/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return {
      user: response.data,
      access_token,
      roles,
    };
  } catch (error) {
    await AsyncStorage.removeItem("user");
    return thunkAPI.rejectWithValue(error.message || "Impossible de récupérer les informations utilisateur");
  }
});

// ✅ Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
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
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.roles = action.payload.roles;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.roles = [];
      })
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
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
  },
});

export const { resetState } = authSlice.actions;
export default authSlice.reducer;

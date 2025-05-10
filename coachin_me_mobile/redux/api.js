import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Base URL de l'API Laravel
const BASE_URL = "http://localhost:9000"; // à ajuster selon ton backend

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Obligatoire pour Sanctum
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  async (config) => {
    let token;

    if (Platform.OS === "web") {
      token = localStorage.getItem("userToken");
    } else {
      token = await AsyncStorage.getItem("userToken");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

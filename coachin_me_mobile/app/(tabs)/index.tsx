import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";

export default function Index() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setIsLoggedIn(!!token);
      } catch (err) {
        console.log("Erreur lors de la vérification du token :", err);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [user]);

  // Redirection si non connecté
  if (isLoggedIn === false) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Bienvenue, {user.name}</Text>
          <Text style={styles.subtitle}>Email : {user.email}</Text>
          <Button title="Déconnexion" onPress={() => dispatch(logoutUser())} />
        </>
      ) : (
        <Text>Chargement des informations...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
});

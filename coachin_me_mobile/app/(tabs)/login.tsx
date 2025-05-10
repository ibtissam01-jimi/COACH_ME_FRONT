import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@redux/slices/authSlice";
import { TextInput, Button, Text, Snackbar, useTheme, ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Login() {
  const dispatch = useDispatch();
  const { isLoading, isError, message } = useSelector((state) => state.auth);
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      setVisible(true);
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Connexion
      </Text>

      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        left={<TextInput.Icon icon={() => <Icon name="email-outline" size={20} color={theme.colors.primary} />} />}
      />

      <TextInput
        mode="outlined"
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        left={<TextInput.Icon icon={() => <Icon name="lock-outline" size={20} color={theme.colors.primary} />} />}
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        contentStyle={styles.buttonContent}
        icon="login"
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator animating={true} color={theme.colors.onPrimary} /> : "Se connecter"}
      </Button>

      {isError && (
        <Text style={styles.error}>
          {message}
        </Text>
      )}

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: "OK",
          onPress: () => setVisible(false),
        }}
      >
        Veuillez remplir tous les champs !
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F5F5F5",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 8,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "#B00020",
    textAlign: "center",
    marginTop: 8,
  },
});

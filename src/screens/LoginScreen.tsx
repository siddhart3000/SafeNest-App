import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginWithEmail, registerWithEmail } from "../services/authService";
import { colors, radius, spacing, typography } from "../theme/theme";
import { getErrorMessage } from "../utils/errorHandler";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (error) {
      Alert.alert("Login failed", getErrorMessage(error, "Could not sign you in."));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email, password);
      Alert.alert("Account created", "Your SafeNest account is ready.");
    } catch (error) {
      Alert.alert("Signup failed", getErrorMessage(error, "Could not create account."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🛡 SafeNest</Text>
      <Text style={styles.tagline}>Realtime cyber-safe family presence.</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignup} disabled={loading}>
          <Text style={styles.linkText}>Create account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  logo: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.sm,
    color: colors.text,
  },
  tagline: {
    ...typography.caption,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    backgroundColor: "#050816",
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    textAlign: "center",
    marginTop: spacing.md,
    color: colors.muted,
    fontSize: 14,
  },
});
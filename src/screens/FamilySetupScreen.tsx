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
import { getCurrentUser } from "../services/authService";
import { createFamilyForUser, joinFamilyByCode } from "../services/familyService";
import { colors, radius, spacing, typography } from "../theme/theme";
import { getErrorMessage } from "../utils/errorHandler";

export default function FamilySetupScreen() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const user = getCurrentUser();
  if (!user) return null;

  const displayName = user.email?.split("@")[0] ?? "Member";

  const handleCreateFamily = async () => {
    setLoading(true);
    try {
      const familyId = await createFamilyForUser(user.uid, displayName);
      Alert.alert("Family created", `Share this code with your family:\n\n${familyId}`);
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error, "Unable to create family."));
    } finally {
      setLoading(false);
    }
  };

  const handleJoinFamily = async () => {
    if (!code.trim()) {
      Alert.alert("Missing code", "Enter your family's invite code.");
      return;
    }

    setLoading(true);
    try {
      await joinFamilyByCode(user.uid, code, displayName);
      Alert.alert("Joined", "You're now part of your SafeNest family.");
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error, "Unable to join family."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Link your SafeNest family</Text>
      <Text style={styles.subtitle}>
        Create a new family space or join an existing one using a shared code.
      </Text>

      <View style={styles.card}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleCreateFamily}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.buttonText}>Create new family</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or join</Text>
          <View style={styles.divider} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter family code"
          placeholderTextColor={colors.muted}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
        />

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleJoinFamily}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Join existing family</Text>
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
  title: {
    ...typography.title,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
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
  button: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: "#050816",
    marginTop: spacing.sm,
  },
  buttonText: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 15,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.md,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    marginHorizontal: spacing.sm,
  },
  input: {
    backgroundColor: "#050816",
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
});
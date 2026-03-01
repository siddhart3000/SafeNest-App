import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getCurrentUser } from "../services/authService";
import { subscribeToUserProfile, UserProfile } from "../services/familyService";
import { EditableProfile, loadInitialProfile, saveProfile, uploadProfilePhoto } from "../services/profileService";
import { colors, radius, spacing, typography } from "../theme/theme";
import { getErrorMessage } from "../utils/errorHandler";
import { formatBatteryPercentage, formatLastOnline, isOnlineFromLastOnline } from "../utils/formatters";

const FAMILY_ROLES = [
  "Parent",
  "Child",
  "Guardian",
  "Grandparent",
  "Sibling",
  "Other",
] as const;

interface ProfileScreenProps {
  familyId: string;
  onBack: () => void;
}

export default function ProfileScreen({ familyId, onBack }: ProfileScreenProps) {
  const user = getCurrentUser();
  const [editable, setEditable] = useState<EditableProfile>({
    name: "",
    role: null,
    photoURL: null,
  });
  const [realtime, setRealtime] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    const bootstrap = async () => {
      try {
        const fallbackName = user.email?.split("@")[0] ?? "Member";
        const initial = await loadInitialProfile(user.uid, familyId, fallbackName);
        if (!mounted) return;
        setEditable(initial);
      } catch (error) {
        Alert.alert("Profile", getErrorMessage(error, "Unable to load profile."));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    const unsubscribe = subscribeToUserProfile(user.uid, (profile) => {
      if (!mounted) return;
      setRealtime(profile);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [familyId, user]);

  const handlePickImage = async () => {
    if (!user) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Allow photo library access to set a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets[0]) return;

    setUploadingPhoto(true);
    try {
      const url = await uploadProfilePhoto(user.uid, familyId, result.assets[0].uri);
      setEditable((prev) => ({ ...prev, photoURL: url }));
    } catch (error) {
      Alert.alert("Upload failed", getErrorMessage(error, "Could not upload photo."));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await saveProfile(user.uid, familyId, editable);
      Alert.alert("Profile saved", "Your SafeNest profile has been updated.");
      onBack();
    } catch (error) {
      Alert.alert("Save failed", getErrorMessage(error, "Could not save profile."));
    } finally {
      setSaving(false);
    }
  };

  if (!user || loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const battery = formatBatteryPercentage(realtime?.batteryLevel);
  const lastOnline = formatLastOnline(realtime?.lastOnline);
  const online =
    realtime?.isOnline || isOnlineFromLastOnline(realtime?.lastOnline);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>My SafeNest profile</Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <Text style={styles.statusLabel}>Device status</Text>
            <Text style={styles.statusValue}>
              {battery} · last online {lastOnline}
            </Text>
          </View>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: online ? "rgba(34,197,94,0.12)" : "rgba(248,113,113,0.12)" },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: online ? colors.primary : colors.danger },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: online ? colors.primary : colors.danger },
              ]}
            >
              {online ? "Online" : "Offline"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handlePickImage}
          disabled={uploadingPhoto}
        >
          {uploadingPhoto ? (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <ActivityIndicator color={colors.text} />
            </View>
          ) : editable.photoURL ? (
            <Image source={{ uri: editable.photoURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {editable.name?.charAt(0)?.toUpperCase() || "?"}
              </Text>
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Text style={styles.cameraBadgeText}>📷</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHint}>Tap to update your avatar</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor={colors.muted}
          value={editable.name}
          onChangeText={(name) => setEditable((prev) => ({ ...prev, name }))}
        />

        <Text style={styles.label}>Role in family</Text>
        <View style={styles.roleGrid}>
          {FAMILY_ROLES.map((role) => {
            const selected = editable.role === role;
            return (
              <TouchableOpacity
                key={role}
                style={[styles.roleChip, selected && styles.roleChipSelected]}
                onPress={() =>
                  setEditable((prev) => ({ ...prev, role: selected ? null : role }))
                }
              >
                <Text
                  style={[
                    styles.roleChipText,
                    selected && styles.roleChipTextSelected,
                  ]}
                >
                  {role}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.saveButtonText}>Save profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  backButton: {
    marginRight: spacing.md,
  },
  backText: {
    fontSize: 20,
    color: colors.text,
  },
  title: {
    ...typography.title,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  statusLeft: {},
  statusLabel: {
    ...typography.caption,
  },
  statusValue: {
    ...typography.body,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.lg,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  avatarContainer: {
    alignSelf: "center",
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  avatarPlaceholder: {
    backgroundColor: "#050816",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 40,
    color: colors.text,
    fontWeight: "700",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  cameraBadgeText: {
    fontSize: 16,
  },
  avatarHint: {
    ...typography.caption,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: spacing.xs,
  } as any,
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.lg,
  },
  roleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  roleChip: {
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  roleChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleChipText: {
    ...typography.caption,
  },
  roleChipTextSelected: {
    color: colors.background,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 16,
  },
});

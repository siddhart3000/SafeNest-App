import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, radius, typography } from "../theme/theme";
import { logError } from "../utils/errorHandler";

interface GlobalErrorBoundaryState {
  hasError: boolean;
  message: string | null;
}

export class GlobalErrorBoundary extends React.Component<
  React.PropsWithChildren,
  GlobalErrorBoundaryState
> {
  state: GlobalErrorBoundaryState = {
    hasError: false,
    message: null,
  };

  static getDerivedStateFromError(error: unknown): GlobalErrorBoundaryState {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    logError("GlobalErrorBoundary.componentDidCatch", {
      error,
      info: errorInfo.componentStack,
    });
  }

  private handleReload = () => {
    this.setState({ hasError: false, message: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.subtitle}>
            The SafeNest app hit an unexpected error. You can try again.
          </Text>

          <TouchableOpacity style={styles.button} onPress={this.handleReload}>
            <Text style={styles.buttonText}>Try again</Text>
          </TouchableOpacity>

          {__DEV__ && this.state.message ? (
            <Text style={styles.devMessage}>{this.state.message}</Text>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  card: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  buttonText: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 16,
  },
  devMessage: {
    ...typography.caption,
    marginTop: spacing.sm,
    color: colors.muted,
  },
});


import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { FONT_FAMILY } from "../theme/fonts";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { reportError } from "../monitoring/errorReporting";

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (__DEV__) {
      console.error("ErrorBoundary caught:", error, info);
    }
    reportError(error, {
      source: "ErrorBoundary",
      componentStack: info.componentStack,
    });
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Что-то пошло не так</Text>
          <Text style={styles.message}>
            {this.state.error?.message ?? "Неизвестная ошибка"}
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.reset}>
            <Text style={styles.buttonText}>Попробовать снова</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
    backgroundColor: colors.surface.neutral,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.xxl,
  },
  button: {
    backgroundColor: colors.brand.primary,
    minHeight: 44,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.text.inverse,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: FONT_FAMILY.button,
  },
});

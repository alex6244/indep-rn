import React, { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";

type Props = TextInputProps & {
  label?: string;
  errorText?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  rightElement?: React.ReactNode;
};

export const AppInput = forwardRef<TextInput, Props>(function AppInput(
  {
    label,
    errorText,
    disabled = false,
    containerStyle,
    rightElement,
    style,
    placeholderTextColor,
    editable,
    ...rest
  },
  ref,
) {
  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View>
        <TextInput
          ref={ref}
          {...rest}
          editable={editable ?? !disabled}
          style={[
            styles.input,
            rightElement ? styles.inputWithRightElement : null,
            disabled ? styles.inputDisabled : null,
            style,
          ]}
          placeholderTextColor={placeholderTextColor ?? colors.control.inputPlaceholder}
        />
        {rightElement ? <View style={styles.rightElement}>{rightElement}</View> : null}
      </View>
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.control.inputBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    lineHeight: 20,
    color: colors.text.primary,
  },
  inputWithRightElement: {
    paddingRight: 44,
  },
  rightElement: {
    position: "absolute",
    right: spacing.sm,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  inputDisabled: {
    opacity: 0.72,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: 12,
    lineHeight: 16,
    color: colors.status.warning,
  },
});


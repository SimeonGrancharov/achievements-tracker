import { useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  type TextInputProps as RNTextInputProps,
} from 'react-native';

type ThemeColors = {
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
};

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  colors?: ThemeColors;
}

const defaultColors: ThemeColors = {
  background: '#fff',
  text: '#333',
  textSecondary: '#999',
  border: '#ddd',
  primary: '#007AFF',
};

export function TextInput({ label, error, style, colors: c, ...props }: TextInputProps) {
  const [focused, setFocused] = useState(false);
  const colors = c ?? defaultColors;

  return (
    <View>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          { backgroundColor: colors.background, borderColor: colors.border, color: colors.text },
          focused && { borderColor: colors.primary },
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
});

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#000',
  },
  secondary: {
    backgroundColor: '#e5e7eb',
  },
  destructive: {
    backgroundColor: '#ef4444',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#000',
  },
  destructiveText: {
    color: '#fff',
  },
  outlineText: {
    color: '#000',
  },
  disabled: {
    opacity: 0.5,
  },
});

export function Button({
  children,
  variant = 'primary',
  disabled = false,
  onPress,
  style,
  ...props
}) {
  const variantStyle = styles[variant];
  const textColorStyle = styles[`${variant}Text`];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      <Text style={[styles.buttonText, textColorStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

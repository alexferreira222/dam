import React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  small: {
    fontSize: 11,
  },
});

export function Label({ children, size = 'default', style, ...props }) {
  const sizeStyle = size === 'small' ? styles.small : {};

  return (
    <Text style={[styles.label, sizeStyle, style]} {...props}>
      {children}
    </Text>
  );
}

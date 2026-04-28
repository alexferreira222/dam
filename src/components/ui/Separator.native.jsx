import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  vertical: {
    width: 1,
    height: '100%',
  },
});

export function Separator({ orientation = 'horizontal', style, ...props }) {
  const orientationStyle =
    orientation === 'vertical' ? styles.vertical : styles.separator;

  return <View style={[orientationStyle, style]} {...props} />;
}

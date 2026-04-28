import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionActive: {
    backgroundColor: '#000',
  },
  optionInactive: {
    backgroundColor: '#fff',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  optionTextActive: {
    color: '#fff',
  },
  optionTextInactive: {
    color: '#666',
  },
});

export function ToggleGroup({ options, value, onValueChange, style }) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.option,
            value === option.value ? styles.optionActive : styles.optionInactive,
          ]}
          onPress={() => onValueChange(option.value)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.optionText,
              value === option.value ? styles.optionTextActive : styles.optionTextInactive,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

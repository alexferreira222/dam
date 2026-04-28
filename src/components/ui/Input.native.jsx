import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  focusedInput: {
    borderColor: '#000',
    outlineWidth: 0,
  },
  placeholder: {
    color: '#9ca3af',
  },
});

export function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  editable = true,
  style,
  ...props
}) {
  const [focused, setFocused] = React.useState(false);

  return (
    <View>
      <TextInput
        style={[
          styles.input,
          focused && styles.focusedInput,
          style,
        ]}
        placeholder={placeholder}
        placeholderTextColor={styles.placeholder.color}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        editable={editable}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    </View>
  );
}

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create({
  alert: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  default: {
    backgroundColor: '#f3f4f6',
    borderLeftWidth: 4,
    borderLeftColor: '#6b7280',
  },
  destructive: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  warning: {
    backgroundColor: '#fffbeb',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  success: {
    backgroundColor: '#f0fdf4',
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
  },
  titleDefault: {
    color: '#1f2937',
  },
  titleDestructive: {
    color: '#991b1b',
  },
  titleWarning: {
    color: '#92400e',
  },
  titleSuccess: {
    color: '#166534',
  },
  descriptionDefault: {
    color: '#374151',
  },
  descriptionDestructive: {
    color: '#7f1d1d',
  },
  descriptionWarning: {
    color: '#78350f',
  },
  descriptionSuccess: {
    color: '#15803d',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
});

export function Alert({
  variant = 'default',
  title,
  description,
  icon,
  onClose,
  style,
  ...props
}) {
  const variantStyle = styles[variant];
  const titleColorStyle = styles[`title${variant.charAt(0).toUpperCase() + variant.slice(1)}`];
  const descriptionColorStyle = styles[`description${variant.charAt(0).toUpperCase() + variant.slice(1)}`];

  return (
    <View style={[styles.alert, variantStyle, style]} {...props}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.content}>
        {title && (
          <Text style={[styles.title, titleColorStyle]}>
            {title}
          </Text>
        )}
        {description && (
          <Text style={[styles.description, descriptionColorStyle]}>
            {description}
          </Text>
        )}
      </View>
      {onClose && (
        <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
          <Text style={{ fontSize: 18, color: '#999' }}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

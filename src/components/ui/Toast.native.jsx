import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  toast: {
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  default: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  success: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  error: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  warning: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  defaultTitle: {
    color: '#1f2937',
  },
  successTitle: {
    color: '#166534',
  },
  errorTitle: {
    color: '#991b1b',
  },
  warningTitle: {
    color: '#92400e',
  },
});

export function Toast({
  message,
  title,
  variant = 'default',
  duration = 4000,
  onClose,
}) {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  }, []);

  const variantStyle = styles[variant];
  const titleColorStyle = styles[`${variant}Title`];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
        },
      ]}
    >
      <View style={[styles.toast, variantStyle]}>
        <View style={{ flex: 1 }}>
          {title && (
            <Text style={[styles.title, titleColorStyle]}>
              {title}
            </Text>
          )}
          <Text style={[styles.title, titleColorStyle]}>
            {message}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

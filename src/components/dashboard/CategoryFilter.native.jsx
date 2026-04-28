import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { getCategoryIcon } from '@/lib/campusflow-utils';

const categories = ['Todos', 'Cantina', 'Bar', 'Biblioteca', 'Laboratório', 'Auditório'];

export default function CategoryFilter({ active, onChange }) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => {
          const isActive = active === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onChange(cat)}
              style={[
                styles.button,
                isActive ? styles.buttonActive : styles.buttonInactive
              ]}
              activeOpacity={0.7}
            >
              {cat !== 'Todos' && (
                <Text style={styles.icon}>{getCategoryIcon(cat)}</Text>
              )}
              <Text style={[
                styles.text,
                isActive ? styles.textActive : styles.textInactive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  buttonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  buttonInactive: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  textActive: {
    color: '#fff',
  },
  textInactive: {
    color: '#666',
  },
});

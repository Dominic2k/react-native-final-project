import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Category } from '../types/Objects';
import { COLORS, BORDER } from '../constants/colors';

interface Props {
  categories: Category[];
  selectedId: number | undefined;
  onSelect: (id: number| undefined) => void;
}

const CategorySelector = ({ categories, selectedId, onSelect }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          selectedId === undefined && styles.selectedButton, 
        ]}
        onPress={() => {
          onSelect(undefined);
        }}
      >
        <Text style={[styles.text,selectedId === undefined && styles.selectedText]}> All</Text>
      </TouchableOpacity>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[
            styles.button,
            cat.id === selectedId && styles.selectedButton, 
          ]}
          onPress={() => {
            onSelect(cat.id);
          }}
        >
          <Text style={[styles.text, cat.id === selectedId && styles.selectedText]}>
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginTop: 10,
    paddingHorizontal: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 10,
    margin: 5,
    minWidth: 90,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER.LIGHT,
  },
  selectedButton: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
    elevation: 4,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  text: {
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
    fontSize: 14,
  },
  selectedText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
  }
});

export default CategorySelector;


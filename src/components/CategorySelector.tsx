import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Category } from '../types/Objects';

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
        <Text style={[styles.text,selectedId === undefined && styles.selectedText]}> Tất cả</Text>
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
    marginTop: 10 
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ccc', // Nền màu xám cho nút chưa chọn
    borderRadius: 6,
    margin: 5,
    minWidth: 80, // Chiều rộng tối thiểu cho nút
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#007bff', // Nền màu xanh dương nổi bật cho nút đang chọn
  },
  text: {
    color: '#000', // Màu chữ mặc định
    fontWeight: 'normal',
  },
  selectedText: {
    color: '#fff', // Màu chữ trắng khi nút được chọn
    fontWeight: 'bold',
  }
});

export default CategorySelector;


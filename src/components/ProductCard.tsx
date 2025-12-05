import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, {} from 'react'
import {COLORS, BORDER, FONT_SIZE}  from '../constants/colors'
import { formatCurrency } from '../utils/formatCurrency'
import { Product } from '../types/Objects'
import { HomeStackParamList } from '../types/Params';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native'

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Products'>;

const ProductCard = ({ item }: { item: Product }) => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <TouchableOpacity
        onPress={() => navigation.navigate('Detail', { product: item })}  // Điều hướng sang Details với product được truyền qua tham số
    >
        <View style={styles.productCard}>
        <Image source={{uri: item.image}} style={styles.productImage} />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
        </View>
    </TouchableOpacity>
  )
}

export default ProductCard

const styles = StyleSheet.create({
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 6,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  productImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
  },

  productName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.TEXT_PRIMARY,
  },

  productPrice: {
    fontSize: FONT_SIZE.SECONDARY,
    fontWeight: '700',
    color: COLORS.PRICE,
    marginVertical: 8,
  },

  buyButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buyButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
    fontSize: 13,
  },
});
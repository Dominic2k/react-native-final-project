import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native'
import React, {} from 'react'
import {COLORS, BORDER, FONT_SIZE}  from '../constants/colors'
import { formatCurrency } from '../utils/formatCurrency'
import { Product } from '../types/Objects'
import { HomeStackParamList } from '../types/Params';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native'

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Products'>;

const screenWidth = Dimensions.get('window').width;
// Calculate card width: (screen width - container padding * 2 - gap between cards) / 2
const cardWidth = (screenWidth - 20 - 8) / 2; // 20 = paddingHorizontal (10*2), 8 = gap between cards

const ProductCard = ({ item }: { item: Product }) => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <TouchableOpacity
        onPress={() => navigation.navigate('Detail', { product: item })}  // Điều hướng sang Details với product được truyền qua tham số
    >
        <View style={[styles.productCard, { width: cardWidth }]}>
        <Image source={{uri: item.image}} style={styles.productImage} />
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
        </View>
    </TouchableOpacity>
  )
}

export default ProductCard

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: COLORS.CARD_BG,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: BORDER.LIGHT,
  },

  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    resizeMode: 'cover',
  },

  productName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
    minHeight: 36,
  },

  productPrice: {
    fontSize: FONT_SIZE.SECONDARY,
    fontWeight: '700',
    color: COLORS.PRICE,
    marginTop: 4,
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
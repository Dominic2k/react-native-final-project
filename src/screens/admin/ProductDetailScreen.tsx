import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import React from 'react'
import { AdminStackParamList } from '../../types/Params';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ProductDetailRouteProp = RouteProp< AdminStackParamList, 'ProductDetail'>;
type NavigationProp = NativeStackNavigationProp<AdminStackParamList, 'ProductManagement'>;
const ProductDetail = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { product} = route.params;
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Image source={{uri: product.image}} style={styles.image} />
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{product.price.toLocaleString()} đ</Text>
    </ScrollView>

  )
}

export default ProductDetail

const styles = StyleSheet.create({
    container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: '#d32f2f',
    fontWeight: '600',
  },
})
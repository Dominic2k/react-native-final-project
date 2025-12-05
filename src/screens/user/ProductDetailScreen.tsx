import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation , useFocusEffect} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Product, Category, User} from '../../types/Objects';
import CategorySelector from '../../components/CategorySelector';
import {HomeStackParamList, BottomTabParamList} from '../../types/Params';
import { getAllData, insertData, checkProductInOrder } from '../../database/dbHelpers';
import ErrorBlock from '../../components/ErrorBlock';
import LoadingSpiner from '../../components/LoadingSpiner';
import { COLORS } from '../../constants/colors';
import { formatCurrency } from '../../utils/formatCurrency';

type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'Detail'>;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Detail'>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { product } = route.params; 
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [errorMessage, setErrorMessage]= useState<string>('');
  const [isInCart, setIsInCart] = useState<boolean>(false);
  const [qty, setQty]= useState<number>(1);

  const initScreen = useCallback(async ()=>{
    try{
        setIsLoading(true);
        setErrorMessage('');
        const categoriesData = await getAllData('categories');
        setCategories(categoriesData)
        const data = await AsyncStorage.getItem('loggedInUser');
        let exists = false;
        if (data) {
          const curUser = JSON.parse(data);
          setUser(curUser);
          exists = await checkProductInOrder(product.id,curUser.id);
        };  
        setIsInCart(exists);
       
    }catch (err: any){
        setErrorMessage(err.message || 'Unidentified error')
    }finally {
        setIsLoading(false); 
    }   
  },[])

  useFocusEffect(
    useCallback(() => { 
      initScreen();
    }, [initScreen])
  );

  const handleSelectCategory = (id: number | undefined) => {
    const selected = categories.find((c) => c.id === id);
    navigation.navigate('Products', { categoryId: selected ? selected.id : undefined });
  };

  const addToCart = async () => {
    if(!user){
      Alert.alert('Chưa đăng nhập', 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng nhập', onPress: () => navigation.navigate('Login' as never) },
      ]);
      return;
    }
    if(user.role === "admin"){
      Alert.alert('Không có quyền', 'Vui lòng đăng nhập băn tài khoản user đẻ có thể thực hiện được tính năng!', [
        { text: 'Ok' }
      ]);
      return;
    }
    try{
        setIsLoading(true);
        setErrorMessage('');
        if(isInCart){
          navigation.navigate('Cart' as never);
          return;
        }
        const newOrder= [
            {field: 'productId', newValue: product.id},
            {field: 'qty', newValue: qty},
            {field: 'status', newValue: 'cart'},
            {field: 'userId', newValue: user.id}, 
        ];
        await insertData('orders', newOrder);
        Alert.alert(
          'Xác nhận thêm thành công!',
          'Thêm vào giỏ hàng thành công!',
          [{text: 'Xem giỏ hàng', onPress: () => navigation.navigate('Cart' as never)},]
        );
    }catch (err: any){
        setErrorMessage(err.message || 'Unidentified error')
    }finally {
        setIsLoading(false);
    }   
  }

  if (errorMessage) {
    return (
      <ErrorBlock 
        message={errorMessage} 
        onRetry={initScreen}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LoadingSpiner visible={isLoading} text="Đang khởi tạo..." />

      {/* Product Image */}
      <View style={styles.imageWrapper}>
        <Image 
          source={{ uri: product.image }} 
          style={styles.image} 
        />
      </View>

      {/* Product Info Card */}
      <View style={styles.card}>

        {/* Tên & giá */}
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>

        {/* Quantity */}
        {!isInCart &&(
          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Số lượng:</Text>
            <View style={styles.qtyControl}>
              <TouchableOpacity 
                style={styles.qtyButton}
                onPress={() => setQty(Math.max(1, qty - 1))}
              >
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.qtyValue}>{qty}</Text>
              <TouchableOpacity 
                style={styles.qtyButton}
                onPress={() => setQty(qty + 1)}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Buy Button */}
        <TouchableOpacity style={styles.buyButton} onPress={addToCart}>
          <Text style={styles.buyButtonText}>{isInCart? 'Đến giỏ hàng' : 'Đặt Hàng'}</Text>
        </TouchableOpacity>
      </View>

      {/* Related Category */}
      <Text style={styles.label}>Sản phẩm liên quan</Text>

      <CategorySelector
        categories={categories} 
        selectedId={product.categoryId}
        onSelect={handleSelectCategory}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 16,
    backgroundColor: COLORS.BACKGROUND,
  },

  /* IMAGE */
  imageWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  image: { 
    width: '100%', 
    height: 260,
    resizeMode: 'contain',
    borderRadius: 12,
  },

  /* CARD INFO */
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  name: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },

  price: { 
    fontSize: 20, 
    color: COLORS.PRICE,
    fontWeight: '600',
    marginBottom: 20,
  },

  /* QUANTITY */
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  qtyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },

  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  qtyButton: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },

  qtyButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#444',
  },

  qtyValue: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 14,
    width: 28,
    textAlign: 'center',
    color: COLORS.TEXT_PRIMARY,
  },

  /* BUY BUTTON */
  buyButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buyButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
    fontSize: 16,
  },

  /* CATEGORY LABEL */
  label: { 
    marginTop: 10, 
    marginBottom: 10,
    fontSize: 18, 
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
});

export default ProductDetailScreen;

import React from 'react';
import { ImageSourcePropType,FlatList,View, ScrollView, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
//1a. import NativeStackScreenProps
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import { Product } from '../../types/Objects';
import { HomeStackParamList } from '../../types/Params';
import { useEffect, useState, useCallback } from 'react';
import { getAllData } from '../../database/dbHelpers';
import Header from '../../components/UserHeader';
import ErrorBlock from '../../components/ErrorBlock';
import LoadingSpiner from '../../components/LoadingSpiner';
import { formatCurrency } from '../../utils/formatCurrency';
import {COLORS, BORDER, FONT_SIZE} from '../../constants/colors'
import ProductCard from '../../components/ProductCard';

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const HomeScreen= ({ navigation }: HomeScreenProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [errorMessage, setErrorMessage]= useState<string>('')

  const initScreen = useCallback( async ()=>{
    try{
        setIsLoading(true);
        setErrorMessage('');
        const productsData = await getAllData('products');
        setProducts(productsData)
    }catch (err: any){
        setErrorMessage(err.message || 'Unidentified error')
    }finally {
        setIsLoading(false); 
    }
  },[]);

  useFocusEffect(
      useCallback(() => { 
        initScreen();
      }, [initScreen])
  );

  if (errorMessage) {
    return (
    <ErrorBlock 
        message={errorMessage} 
        onRetry={initScreen}
    />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LoadingSpiner visible={isLoading} text="Loading..." />
      {/* Banner */}
        <Image style={styles.banner} source={require('../../assets/banner/image.jpg')} />
      {/* Menu ngang */}
      <Header/>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Products',{categoryId: undefined})}>
          <Text style={styles.menuText}>Products</Text>
        </TouchableOpacity>
      </View>
      {/* hiển thị ra danh sách sản phẩm tĩnh với hình ảnh lấy ngẫu nhiên*/}
      <FlatList
        scrollEnabled={false}
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={ ({item})=>(
          <ProductCard  item={item}/>
        )
        }
        contentContainerStyle={styles.listContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  /* --- BANNER --- */
  banner: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    opacity: 0.9,
  },

  /* --- MENU NGANG --- */
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.CARD_BG,
    paddingVertical: 12,
    marginTop: 8,
    borderRadius: 14,
    marginHorizontal: 10,
    elevation: 6,
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: BORDER.LIGHT,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },

  /* --- LIST PRODUCT --- */
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;

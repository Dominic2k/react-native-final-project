import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Modal, Dimensions } from 'react-native';
import { RouteProp, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Category, Product } from '../../types/Objects';
import { HomeStackParamList } from '../../types/Params';
import { getAllData, searchProductsByNameOrCategory } from '../../database/dbHelpers';

import CategorySelector from '../../components/CategorySelector';
import ErrorBlock from '../../components/ErrorBlock';
import LoadingSpiner from '../../components/LoadingSpiner';
import { COLORS } from '../../constants/colors';
import ProductCard from '../../components/ProductCard';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const width = Dimensions.get('window').width;

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Products'>;
type RouteProps = RouteProp<HomeStackParamList, 'Products'>;

export default function ProductScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { categoryId } = route.params;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [errorMessage, setErrorMessage]= useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [querySearch, setQuerySearch] = useState<string>('');
  const [showPriceModal, setShowPriceModal]= useState<boolean>(false);

  /** INIT */
  const initScreen = useCallback(async ()=>{
    try{
        setIsLoading(true);
        setErrorMessage('');
        const categoriesData = await getAllData('categories');
        const productsData = await getAllData('products');
        setCategories(categoriesData);
        setProducts(productsData);
    }catch (err: any){
        setErrorMessage(err.message || 'Unidentified error');
    }finally {
        setIsLoading(false); 
    }
  },[]);

  useFocusEffect(
      useCallback(() => { 
        initScreen();
      }, [initScreen])
  );

  /** SEARCH */
  useEffect(()=>{
    const search = async () => {
        try{
            setIsLoading(true);
            setErrorMessage('');
            const results = await searchProductsByNameOrCategory(querySearch);
            setProducts(results);
        }catch(err:any){
            setErrorMessage(err.message || 'Unidentified error')
        }finally{
            setIsLoading(false);
        }
    }
    search();
  },[querySearch]);

  /** FILTER PRODUCTS */
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategoryId ? p.categoryId === selectedCategoryId : true;
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchCategory && matchPrice;
  });

  if (errorMessage) return <ErrorBlock message={errorMessage} onRetry={initScreen} />;

  return (
    <View style={styles.container}>
      <LoadingSpiner visible={isLoading} text="Đang tải..." />

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <TextInput 
          placeholder="Tìm kiếm sản phẩm..."
          value={querySearch}
          onChangeText={setQuerySearch}
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={()=>setShowPriceModal(true)} style={styles.filterButton}>
          <Text style={{color:'white', fontWeight:'600'}}>Lọc giá</Text>
        </TouchableOpacity>
      </View>

      {/* CATEGORY SELECTOR */}
      <CategorySelector
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />

      {/* GRID PRODUCTS */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => <ProductCard item={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có sản phẩm phù hợp</Text>
        }
      />

      {/* PRICE FILTER MODAL */}
      <Modal visible={showPriceModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Lọc theo giá</Text>

            <View style={styles.rangeRow}>
              <Text style={styles.rangeText}>{priceRange[0].toLocaleString('vi-VN')} đ</Text>
              <Text>-</Text>
              <Text style={styles.rangeText}>{priceRange[1].toLocaleString('vi-VN')} đ</Text>
            </View>

            <MultiSlider
              values={priceRange}
              sliderLength={width * 0.7}
              onValuesChange={setPriceRange}
              min={0}
              max={10000000}
              step={50000}
              selectedStyle={{ backgroundColor: COLORS.PRIMARY }}
              markerStyle={{ backgroundColor: COLORS.PRIMARY }}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.resetBtn} onPress={() => setPriceRange([0,10000000])}>
                <Text>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.applyBtn} onPress={() => setShowPriceModal(false)}>
                <Text style={{color:'white'}}>Áp dụng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: COLORS.BACKGROUND
  },

  searchBox:{
    flexDirection:'row',
    padding:10,
    gap:10
  },
  searchInput:{
    flex:1,
    backgroundColor:'#fff',
    padding:10,
    borderRadius:10,
    elevation:2
  },
  filterButton:{
    backgroundColor:COLORS.PRIMARY,
    paddingVertical:10,
    paddingHorizontal:16,
    borderRadius:10,
    justifyContent:'center'
  },

  listContainer:{
    paddingHorizontal:10,
    paddingBottom:60
  },

  emptyText:{
    textAlign:'center',
    marginTop:20,
    color:'#555'
  },

  /* MODAL */
  modalOverlay:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent:'center',
    alignItems:'center'
  },
  modalContent:{
    width:'85%',
    backgroundColor:'#fff',
    padding:20,
    borderRadius:12
  },
  modalTitle:{
    fontSize:18,
    fontWeight:'700',
    marginBottom:20
  },
  rangeRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom:10
  },
  rangeText:{
    fontWeight:'700',
    color:COLORS.PRIMARY
  },

  modalButtons:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:20
  },
  resetBtn:{
    backgroundColor:'#ccc',
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:8
  },
  applyBtn:{
    backgroundColor:COLORS.PRIMARY,
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:8
  }
});

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import {
  RouteProp,
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Category, Product } from '../../types/Objects';
import { HomeStackParamList } from '../../types/Params';
import {
  getAllData,
  searchProductsByNameOrCategory,
  getProductsByCategoryId,
} from '../../database/dbHelpers';

import CategorySelector from '../../components/CategorySelector';
import ErrorBlock from '../../components/ErrorBlock';
import LoadingSpiner from '../../components/LoadingSpiner';
import { COLORS, BORDER } from '../../constants/colors';
import ProductCard from '../../components/ProductCard';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const width = Dimensions.get('window').width;
const MAX_PRICE = 1000000000; // Set a more realistic maximum price

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Products'>;
type RouteProps = RouteProp<HomeStackParamList, 'Products'>;

export default function ProductScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { categoryId: initialCategoryId } = route.params;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] =
    useState(initialCategoryId);
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [querySearch, setQuerySearch] = useState<string>('');
  const [showPriceModal, setShowPriceModal] = useState<boolean>(false);

  /** INIT */
  const initScreen = useCallback(async () => {
    // This function now only fetches categories.
    // Products are fetched in a separate effect to handle filtering.
    try {
      const categoriesData = await getAllData('categories');
      setCategories(categoriesData);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unidentified error');
    }
  }, []);

  /** HANDLE CATEGORY CHANGE */
  const handleCategoryChange = useCallback((categoryId: number | undefined) => {
    setSelectedCategoryId(categoryId);
    setPriceRange([0, MAX_PRICE]); // Reset giá khi đổi danh mục
    setQuerySearch(''); // Also reset search when category changes
  }, []);

  useFocusEffect(
    useCallback(() => {
      initScreen();
      // When the screen is focused, update the selected category from route params
      // and clear any previous search query.
      setSelectedCategoryId(initialCategoryId);
      setQuerySearch('');
    }, [initScreen]),
  );

  /** DATA FETCHING EFFECT (handles category change and search) */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        // If search query exists, prioritize search
        if (querySearch.trim() === '') {
          // No search query, filter by category from the database
          const productList = selectedCategoryId
            ? await getProductsByCategoryId(selectedCategoryId)
            : await getAllData('products');
          setProducts(productList);
        } else {
          const results = await searchProductsByNameOrCategory(querySearch);
          setProducts(results);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Unidentified error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [querySearch, selectedCategoryId]);

  /** FILTER PRODUCTS */
  const filteredProducts = products.filter(p => {
    const productPrice = Number(p.price);

    // Filter by price range
    const matchPrice =
      productPrice >= priceRange[0] && productPrice <= priceRange[1];

    // Category filtering is now done by the database query in the useEffect hook.
    // We only need to filter by price on the client side.
    return matchPrice;
  });

  if (errorMessage)
    return <ErrorBlock message={errorMessage} onRetry={initScreen} />;

  return (
    <View style={styles.container}>
      <LoadingSpiner visible={isLoading} text="Loading..." />

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search products..."
          value={querySearch}
          onChangeText={setQuerySearch}
          style={styles.searchInput}
        />
        <TouchableOpacity
          onPress={() => setShowPriceModal(true)}
          style={styles.filterButton}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>
            Filter Price
          </Text>
        </TouchableOpacity>
      </View>

      {/* CATEGORY SELECTOR */}
      <CategorySelector
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={handleCategoryChange}
      />

      {/* GRID PRODUCTS */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={item => item.id.toString()}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => <ProductCard item={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found</Text>
        }
      />

      {/* PRICE FILTER MODAL */}
      <Modal visible={showPriceModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Price</Text>

            <View style={styles.rangeRow}>
              <Text style={styles.rangeText}>
                ${priceRange[0].toLocaleString('en-US')}
              </Text>
              <Text>-</Text>
              <Text style={styles.rangeText}>
                ${priceRange[1].toLocaleString('en-US')}
              </Text>
            </View>

            <MultiSlider
              values={priceRange}
              sliderLength={width * 0.7}
              onValuesChange={setPriceRange}
              min={0}
              max={MAX_PRICE}
              step={50000}
              selectedStyle={{ backgroundColor: COLORS.PRIMARY }}
              markerStyle={{ backgroundColor: COLORS.PRIMARY }}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => setPriceRange([0, MAX_PRICE])}
              >
                <Text>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => setShowPriceModal(false)}
              >
                <Text style={{ color: 'white' }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  searchBox: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.CARD_BG,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: BORDER.LIGHT,
  },
  filterButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },

  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 60,
    paddingTop: 10,
  },
  row: {
    justifyContent: 'space-between',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.TEXT_SECONDARY,
    fontSize: 16,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.CARD_BG,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER.LIGHT,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: COLORS.TEXT_PRIMARY,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rangeText: {
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  resetBtn: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER.LIGHT,
  },
  applyBtn: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});

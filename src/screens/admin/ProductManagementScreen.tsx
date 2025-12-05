import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, FlatList, Image, Alert} from 'react-native'
import React, {useEffect, useState, useLayoutEffect, useCallback} from 'react';
import {Picker} from '@react-native-picker/picker';
import { launchImageLibrary ,ImageLibraryOptions} from 'react-native-image-picker';
import { getAllData, searchProductsByNameOrCategory, insertData, deleteData, updateData } from '../../database/dbHelpers';
import { Product,Category } from '../../types/Objects';
import { useNavigation, useFocusEffect, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../types/Params';
import HeaderMenu from '../../components/HeaderMenu';   
import LoadingSpiner from '../../components/LoadingSpiner';
import ErrorBlock from '../../components/ErrorBlock';
import {COLORS, FONT_SIZE, BORDER} from '../../constants/colors';
import {formatCurrency} from '../../utils/formatCurrency'

type NavigationProp = NativeStackNavigationProp<AdminStackParamList, 'ProductManagement'>;
type ProductRouteProp = RouteProp<AdminStackParamList, 'ProductManagement'>;

const ProductManagementScreen = () => {
  const route = useRoute<ProductRouteProp>();
  const categoryId = route.params?.categoryId;
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [image,setImage] = useState<string>('');
  const [idSelected, setIdSelected] = useState<number | null>(null);
  const [querySearch, setQuerySearch] = useState<string>('');
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [errorMessage, setErrorMessage]= useState<string>('');
  const [errorPriceMessage, setErrorPriceMessage]= useState<string>('');
  
  const navigation = useNavigation<NavigationProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderMenu />,
    });
  }, [navigation]);

  const initScreen = useCallback(async ()=>{
    try{
        setIsLoading(true);
        setErrorMessage('');
        const categoriesData = await getAllData('categories');
        const productsData = await getAllData('products');
        setCategories(categoriesData)
        setProducts(productsData)
        setSelectedCategory(categoryId ? categoryId : (categoriesData.length >0 ? categoriesData[0].id : null));
    }catch(err: any){
        setErrorMessage(err.message || 'Unidentified error')
    }finally{
        setIsLoading(false);
    }
  },[])

  useFocusEffect(
        useCallback(() => { 
          initScreen();
        }, [initScreen])
    );

  const openGallery = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('Người dùng hủy');
      } else if (response.errorCode) {
        console.log('Lỗi: ', response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri ?? '../../source/image1.png';
        setImage(uri);
        console.log(uri);
      }
    });
  };
  const clear=()=>{
    setName('');
    setPrice(null);
    setImage('');
    setSelectedCategory(categories.length >0 ? categories[0].id : null);
    setIdSelected(null);
}
  const addProduct = async()=>{
    setErrorPriceMessage('');
    if(!name || !price || !selectedCategory ){
        Alert.alert('Vui lòng điền đầy đủ thông tin');
        return;
    }
    if (isNaN(price) || price <= 0) {
        setErrorPriceMessage('Giá sản phẩm phải là số lớn hơn 0');
        return;
        }

    if (price < 1000) {
        setErrorPriceMessage('Giá sản phẩm phải từ 1.000đ trở lên');
        return;
    }
    if(name.length < 5 ){
        Alert.alert('Vui lòng điền ít nhất 5 ký tự cho tên sản phẩm');
        return;
    }
    if(errorMessage){
        return;
    }
    const newProduct = [
        {field: 'id', newValue: products.length > 0 ? products[products.length -1].id +1 : 1},
        {field: 'name', newValue: name},
        {field: 'price', newValue: price},
        {field: 'categoryId', newValue: selectedCategory},
        {field: 'image', newValue: image},
    ];
    try{
        setIsLoading(true);
        setErrorMessage('');
        await insertData('products', newProduct);
        const updatedProducts = await getAllData('products');
        setProducts(updatedProducts);
    }catch(err:any){
        setErrorMessage(err.message || 'underfined error')
    }finally{
        setIsLoading(false);
        clear();
    }
    
  }

  const clickEditContact = (id: number) => {
    setIdSelected(id);
    const itemToEdit = products.find(product => product.id === id);
    if (itemToEdit) {
      setName(itemToEdit.name.toString());
      setPrice(itemToEdit.price);
      setSelectedCategory(itemToEdit.categoryId)
      setImage(itemToEdit.image)
    }
  }

  const updateproduct = async(id: number) => {
    setErrorPriceMessage('');
    if(!name || !price || !selectedCategory ){
        Alert.alert('Vui lòng điền đầy đủ thông tin');
        return;
    }
    if (isNaN(price) || price <= 0) {
        setErrorPriceMessage('Giá sản phẩm phải là số lớn hơn 0');
        return;
        }

    if (price < 1000) {
        setErrorPriceMessage('Giá sản phẩm phải từ 1.000đ trở lên');
        return;
    }
    if(name.length < 5 ){
        Alert.alert('Vui lòng điền ít nhất 5 ký tự cho tên sản phẩm');
        return;
    }
    if(errorMessage){
        return;
    }
    for(const product of products){
        if (product.id === id){
            const newProduct = [
            {field: 'name', newValue: name},
            {field: 'price', newValue: price},
            {field: 'categoryId', newValue: selectedCategory},
            {field: 'image', newValue: image},
            ];
            try{
                setIsLoading(true)
                setErrorMessage('');
                await updateData(id,'products', newProduct);
                const updatedProducts = await getAllData('products');
                setProducts(updatedProducts);
            }catch(err:any){
                setErrorMessage(err.message || 'underfined error')
            }finally{
                setIsLoading(false);
                clear();
                break;
            }
        }
    }
  }

  const deleteProduct = (id: number) => {
      Alert.alert(
          'Xác nhận xóa',
          'Bạn có chắc chắn muốn xóa liên lạc này?',
          [
              { text: 'Hủy', style: 'cancel' },
              { 
                text: 'Xóa', 
                onPress: async () => {
                    try{
                        setIsLoading(true)
                        setErrorMessage('');                    
                        await deleteData(id, 'products');
                        const updatedProducts = await getAllData('products');
                        setProducts(updatedProducts);
                        Alert.alert("Xóa thành công!")
                    }catch(err:any){
                        setErrorMessage(err.message || 'underfined error')
                    }finally{
                        setIsLoading(false);
                        clear();
                    }
                }, 
              },
          ]
      );
    }

  const getNameCategoryById = (id: number): string => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name.toString() : 'Unknown';
  }

  useEffect(()=>{
    const searchByNameOrCategory = async (keyword: string) => {
        try{
            setIsLoading(true);
            setErrorMessage('');
            const results = await searchProductsByNameOrCategory(keyword);
            setProducts(results);
        }catch(err:any){
            setErrorMessage(err.message || 'Unidentified error')
        }finally{
            setIsLoading(false);
            clear();
        }      
    }
    searchByNameOrCategory(querySearch);
    },[querySearch])
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
    <LoadingSpiner visible={isLoading} text="Đang khởi tạo..." />
      <Text style={styles.title_header}>📋Item Management</Text>
      <View style={styles.formCard}>
        <TextInput
            style={styles.input}
            placeholder='Nhập tên sản phẩm' 
            value={name}
            onChangeText={text=>setName(text)}
        />
        {errorPriceMessage &&(
            <Text style={{color: 'red', marginBottom: 5, fontSize: 9}}>{errorPriceMessage}</Text>
        )}
        <TextInput
            style={styles.input}
            placeholder='Nhập giá sản phẩm' 
            value={price?.toString()}
            onChangeText={text=>setPrice(Number(text))}
        />
        <View style={styles.picker_container}>
            <Picker
                selectedValue= {selectedCategory}
                onValueChange={value=> setSelectedCategory(Number(value))}
            >
                {
                    categories.length > 0 
                    && categories.map((category) => (
                        <Picker.Item 
                            key={category.id}   
                            label={category.name.toString()}
                            value={category.id}
                        />
                    ))
                }
            </Picker>
        </View>
        <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={styles.button_upload_image} onPress={openGallery}>
                <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 12, fontWeight: 'bold'}}>🗃 Chọn ảnh trong thư viện</Text>
            </TouchableOpacity>
            <Image source={{uri: image}} style={styles.thumbnail}/>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {
                idSelected ?(
                    <>
                        <TouchableOpacity style={styles.button} onPress={()=>{updateproduct(idSelected)}} >
                            <Text style={{color:COLORS.TEXT_PRIMARY, fontSize:18, fontWeight:'bold' }}>✏️ Cập Nhật</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={()=>{clear(); setIdSelected(null);}} >
                            <Text style={{color:COLORS.TEXT_PRIMARY, fontSize:18, fontWeight:'bold' }}>❌ Hủy</Text>
                        </TouchableOpacity>
                    </>
                ):(
                    <TouchableOpacity style={styles.button} onPress={()=>addProduct()}>
                        <Text style={{color:COLORS.TEXT_PRIMARY, fontSize: 15, fontWeight: 'bold'}}>➕ Thêm</Text>
                    </TouchableOpacity>
                )
            }
        </View>
      </View>
      <TextInput
            style={styles.input}
            placeholder='🔍 Tìm kiếm theo tên sản phẩm hay tên loại' 
            value={querySearch}
            onChangeText={
                text=> setQuerySearch(text)
            }/>
      <FlatList
        data={products}
        keyExtractor = {(item)=> item.id.toString()}
        scrollEnabled={false}
        renderItem={({item})=>(
            <View style={styles.item_container}>
                <TouchableOpacity onPress={()=>navigation.navigate('ProductDetail',{product:item})}>
                <Image 
                    style={styles.item_image}
                    source={{uri : item.image}}/>
                </TouchableOpacity>
                <View style={styles.item_content}>
                    <Text style={styles.main_text}>Tên: {item.name}</Text>
                    <Text style={styles.secondary_text}>Loại {
                        getNameCategoryById(item.categoryId)
                    } </Text>
                    <Text style={styles.price}>Giá {formatCurrency(item.price)}</Text>
                </View>
                <View style={styles.item_buttonContainer}>
                    <TouchableOpacity onPress={()=>{clickEditContact(item.id)}}>
                        <Text>🖊</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>deleteProduct(item.id)}>
                        <Text>🗑</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )}
      />
    </ScrollView>
  )
}

export default ProductManagementScreen

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: COLORS.BACKGROUND,
    },

    /* ----- HEADER ----- */
    title_header: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        color: COLORS.PRIMARY,
        marginBottom: 15,
    },

    /* ----- FORM ----- */
    formCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },

    input: {
        borderWidth: 1.6,
        borderColor: BORDER.PRIMARY,
        borderRadius: 10,
        marginBottom: 12,
        fontSize: FONT_SIZE.PRIMARY,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: '#fff',
        color: COLORS.TEXT_PRIMARY,
    },

    picker_container: {
        borderWidth: 1.6,
        borderColor: BORDER.PRIMARY,
        borderRadius: 10,
        marginBottom: 12,
    },

    button_upload_image: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: BORDER.SECONDARY,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: COLORS.SECONDARY,
        borderRadius: 8,
        marginBottom: 10,
    },

    thumbnail: {
        width: 60,
        height: 50,
        borderRadius: 8,
        marginLeft: 'auto',
        backgroundColor: '#ddd',
    },

    button: {
        width: '60%',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: COLORS.PRIMARY,
        marginTop: 8,
    },

    buttonText: {
        color: COLORS.TEXT_PRIMARY,
        fontSize: 16,
        fontWeight: '700',
    },

    /* ----- LIST ----- */
    searchBox: {
        borderWidth: 1.6,
        borderColor: BORDER.SECONDARY,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },

    item_container: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BORDER.PRIMARY,
        backgroundColor: '#fff',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    item_image: {
        width: 75,
        height: 65,
        borderRadius: 8,
        marginRight: 10,
    },

    item_content: {
        flex: 1,
        gap: 3,
        justifyContent: 'center',
    },

    main_text: {
        color: COLORS.TEXT_PRIMARY,
        fontSize: FONT_SIZE.PRIMARY,
    },

    secondary_text: {
        color: COLORS.TEXT_SECONDARY,
        fontSize: FONT_SIZE.SECONDARY,
    },

    price: {
        color: COLORS.PRICE,
        fontSize: FONT_SIZE.SECONDARY,
        fontWeight: '700',
    },

    item_buttonContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    iconButton: {
        padding: 4,
    },
});

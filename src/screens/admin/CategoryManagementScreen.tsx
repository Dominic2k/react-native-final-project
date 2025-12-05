import { StyleSheet, Text, View , ScrollView, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native'
import React, {useState,useEffect,useLayoutEffect, useCallback} from 'react'
import { getAllData, insertData, deleteData, updateData } from '../../database/dbHelpers';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../types/Params';
import HeaderMenu from '../../components/HeaderMenu';
import ErrorBlock from '../../components/ErrorBlock';
import LoadingSpiner from '../../components/LoadingSpiner';
import { COLORS,BORDER,FONT_SIZE } from '../../constants/colors';

type NavigationProp = NativeStackNavigationProp<AdminStackParamList, 'CategoryManagement'>;

const CategoryManagementScreen = () => {
    const [categories, setCategories] = useState<Array<{id: number; name: string}>>([]);
    const [idSelected, setIdSelected] = useState<number | null>(null);
    const [name, setName] = useState<string>('');
    const [isLoading, setIsLoading]= useState<boolean>(true);
    const [errorMessage, setErrorMessage]= useState<string>('')

    const navigation = useNavigation<NavigationProp>();

    useLayoutEffect(() => {
        navigation.setOptions({
        headerRight: () => <HeaderMenu />,
        });
    }, [navigation]);

    const initScreen = useCallback( async ()=>{
        try{
            setIsLoading(true);
            setErrorMessage('');
            const data = await getAllData('categories');
            setCategories(data);
        }catch (err: any){
            setErrorMessage(err.message || 'Unidentified error')
        }finally {
            setIsLoading(false); 
            clear();
        }
    },[]);

    useFocusEffect(
          useCallback(() => { 
            initScreen();
          }, [initScreen])
      );

    const addCategory = async () => {
        if(!name){
            Alert.alert('Vui lòng nhập tên danh mục');
            return;
        }
        if(name.length < 2 ){
            Alert.alert('Vui lòng nhập ít nhất 2 ký tự cho tên danh mục');
            return;
        }
        const newCategory = [
            {field: 'name', newValue: name},
        ];
        try{
            setIsLoading(true);
            setErrorMessage('');
            await insertData('categories', newCategory);
            const data = await getAllData('categories');
            setCategories(data);
        }catch(err:any){
            setErrorMessage(err.message || 'Unidentified error')
        }finally {
            setIsLoading(false); 
            clear();
        }
        
    };

    const updateCategory = async (id: number) => {
        if(!name){
            Alert.alert('Vui lòng nhập tên danh mục');
            return;
        }
        if(name.length < 2 ){
            Alert.alert('Vui lòng nhập ít nhất 2 ký tự cho tên danh mục');
            return;
        }
        const updatedCategory = [
            {field: 'name', newValue: name},
        ]; 
        try{
            setIsLoading(true);
            setErrorMessage('');
            await updateData(id,'categories', updatedCategory);
            const data = await getAllData('categories');
            setCategories(data);
        }catch (err: any){
            setErrorMessage(err.message || 'Unidentified error')
        }finally {
            setIsLoading(false); 
            clear();
        }  
    };
    const deleteCategory = (id: number) => {
        Alert.alert(
            'Xác nhận xóa'
            ,'Bạn có chắc chắn muốn xóa danh mục này?'
            ,[
                {text: 'Hủy', style: 'cancel'},
                {text: 'OK', onPress: async () => {
                    try{
                        setIsLoading(true);
                        setErrorMessage('');
                        await deleteData(id, 'categories');
                        const data = await getAllData('categories');
                        setCategories(data);
                        if(idSelected === id){
                            clear();
                        }
                    }catch (err: any){
                        setErrorMessage(err.message || 'Unidentified error')
                    }finally {
                        setIsLoading(false); 
                    }  
                }}
            ]
        );
    };

    const clear = () => {
        setName('');
        setIdSelected(null);
    };
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
      <View style={styles.formCard}>
        <Text style={styles.title_header}>Category Management</Text>
        <TextInput
            style={styles.input}
            placeholder='Nhập tên category'
            value={name} 
            onChangeText={text=>setName(text)} />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                {
                    idSelected ?(
                        <>
                            <TouchableOpacity style={styles.button} onPress={()=>{updateCategory(idSelected)}} >
                                <Text style={{color:COLORS.TEXT_PRIMARY, fontSize:15, fontWeight:'bold' }}>✏️ Cập Nhật</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={()=>{clear()}} >
                                <Text style={{color:COLORS.TEXT_PRIMARY, fontSize:15, fontWeight:'bold' }}>❌ Hủy</Text>
                            </TouchableOpacity>
                        </>
                    ):(
                        <TouchableOpacity style={styles.button} onPress={()=>addCategory()}>
                            <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 15, fontWeight: 'bold'}}>➕ Thêm</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        </View>
        <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
                <View style={styles.categoryCard}>
                    <View style={styles.categoryLeft}>
                        <View style={styles.categoryIconBox}>
                            <Text style={{ fontSize: 22 }}>📁</Text>
                        </View>

                        <View style={styles.categoryInfo}>
                            <Text style={styles.categoryName}>{item.name}</Text>
                            <Text style={styles.categoryId}>ID: {item.id}</Text>
                        </View>
                    </View>

                    <View style={styles.categoryActions}>
                        <TouchableOpacity
                            style={styles.editBtn}
                            onPress={() => {
                                setIdSelected(item.id);
                                setName(item.name);
                            }}>
                            <Text style={styles.actionText}>✏️</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={() => deleteCategory(item.id)}>
                            <Text style={styles.actionText}>🗑</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={() => navigation.navigate('ProductManagement', { categoryId: item.id})}>
                            <Text style={styles.actionText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        />
    </ScrollView>
  )
}

export default CategoryManagementScreen

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
    button: {
        width: '60%',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: COLORS.PRIMARY,
        marginTop: 8,
    },
    /* ---------------- CATEGORY CARD UI ------------------ */
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 12,

        // Shadow
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,

        borderWidth: 1,
        borderColor: '#f2f2f2',
    },

    categoryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    categoryIconBox: {
        width: 46,
        height: 46,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },

    categoryInfo: {
        flexDirection: 'column',
    },

    categoryName: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.TEXT_PRIMARY,
    },

    categoryId: {
        fontSize: 12,
        marginTop: 2,
        color: COLORS.TEXT_SECONDARY,
    },

    /* Action Buttons */
    categoryActions: {
        flexDirection: 'row',
        gap: 10,
    },

    editBtn: {
        backgroundColor: '#FFE7B6',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },

    deleteBtn: {
        backgroundColor: '#FFBABA',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },

    actionText: {
        fontSize: 16,
    },

});
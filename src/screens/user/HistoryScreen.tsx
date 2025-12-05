import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Order, Product, User } from '../../types/Objects';
import { getAllData, selectOrderHostry } from '../../database/dbHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants/colors';
import { formatCurrency } from '../../utils/formatCurrency';
import ErrorBlock from '../../components/ErrorBlock';
import LoadingSpiner from '../../components/LoadingSpiner';

const STATUS = ['pending','confirmed','shipping','completed','cancelled'];

export default function HistoryScreen(){
  const [user, setUser] = useState<User|null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentStatus, setCurrentStatus] = useState('pending');
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [errorMessage, setErrorMessage]= useState<string>('');

  const initScreen = useCallback(async ()=>{
    try{
        setIsLoading(true);
        setErrorMessage('');
        const data = await AsyncStorage.getItem('loggedInUser');
        if(data){
          const user = JSON.parse(data);
          setUser(user);
          const allOrders = await selectOrderHostry(user.id);
          const allProducts = await getAllData('products');
          setProducts(allProducts);
          setOrders(allOrders);
        }
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

  if (errorMessage) {
    return (
      <ErrorBlock 
        message={errorMessage} 
        onRetry={initScreen}
      />
    );
  }

  const filtered = orders.filter(o=>o.status.toLowerCase() === currentStatus.toLowerCase());

  const getProduct = (id:number)=> products.find(p=>p.id === id);

  return (
    <View style={styles.container}>
      <LoadingSpiner visible={isLoading} text="Đang tải..." />
      <Text style={styles.title}>📦 Lịch Sử Đơn Hàng</Text>

      {/* Status Tabs */}
      <View style={styles.statusRow}>
        {STATUS.map(s=> (
          <TouchableOpacity key={s} style={[styles.statusBtn, currentStatus===s && styles.statusBtnActive]} onPress={()=>setCurrentStatus(s)}>
            <Text style={[styles.statusText, currentStatus===s && styles.statusTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{marginTop:16}}>
        {filtered.length === 0 && (
          <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
        )}

        {filtered.map(item=>{
          const product = getProduct(item.productId);
          return (
            <View key={item.id} style={styles.card}>
              <Image source={{uri:product?.image}} style={styles.image} />

              <View style={{flex:1, marginLeft:12}}>
                <Text style={styles.name}>{product?.name}</Text>
                <Text style={styles.qty}>Số lượng: {item.qty}</Text>
                <Text style={styles.total}>Tổng: {formatCurrency(item.totalPrice || (product?.price||0)*item.qty)}</Text>
              </View>

              <Text style={styles.statusLabel}>{item.status}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:16, backgroundColor:COLORS.BACKGROUND },
  title:{ fontSize:24, fontWeight:'800', marginBottom:14, color:COLORS.PRIMARY },

  statusRow:{ 
    flexDirection:'row' , 
    flexWrap:'wrap', 
    gap:8, 
    marginVertical:10 
  },
  statusBtn:{ 
    paddingVertical:8, 
    paddingHorizontal:14, 
    borderRadius:20, 
    backgroundColor:'#eee' 
  },
  statusBtnActive:{ backgroundColor:COLORS.PRIMARY },
  statusText:{ fontSize:14, fontWeight:'600', color:'#555' },
  statusTextActive:{ color:'white' },

  card:{ 
    flexDirection:'row', 
    backgroundColor:'white', 
    padding:12, 
    borderRadius:14, 
    marginBottom:12, 
    elevation:3 
  },
  image:{ width:70, height:70, borderRadius:10 },
  name:{ fontSize:16, fontWeight:'700' },
  qty:{ marginTop:4, color:'#666' },
  total:{ marginTop:6, fontWeight:'700', color:COLORS.PRIMARY },
  statusLabel:{ 
    fontWeight:'700', 
    color:COLORS.PRICE, 
    alignSelf:'center' 
  },

  emptyText:{ 
    textAlign:'center', 
    marginTop:40, 
    fontSize:16, 
    color:'#777' 
  },
});

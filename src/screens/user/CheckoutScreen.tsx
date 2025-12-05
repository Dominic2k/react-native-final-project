import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { RouteProp, useRoute, useNavigation , useFocusEffect} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from "../../constants/colors";
import { Product, Order, User } from "../../types/Objects";
import { getAllData, selectOrder, updateData } from "../../database/dbHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatCurrency } from "../../utils/formatCurrency";
import { HomeStackParamList } from "../../types/Params";
import ErrorBlock from "../../components/ErrorBlock";
import LoadingSpiner from "../../components/LoadingSpiner";

type CheckoutRouteProp = RouteProp<HomeStackParamList, 'Checkout'>;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Checkout'>;


export default function CheckoutScreen() {
  const route = useRoute<CheckoutRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { order } = route.params; 
  const [user, setUser] = useState<User | null>(null);
  const [product, setProduct] = useState<Product|null>(null);
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [errorMessage, setErrorMessage]= useState<string>('');

  const initScreen = useCallback(async ()=>{
    try{
        setIsLoading(true);
        setErrorMessage('');
        const data = await AsyncStorage.getItem("loggedInUser");
        if (data) {
          const curUser = JSON.parse(data);
          setUser(curUser);

          const productData = await getAllData("products");    
          const currentProduct = productData.find((p: Product) => p.id === order.productId) || null;
          if(!currentProduct){
            throw new Error("Sản phẩm không tồn tại");
          }
          setProduct(currentProduct);
        }else{
          throw new Error("Chưa đăng nhập");
        }
    }catch (err: any){
        setErrorMessage(err.message || 'Unidentified error');
    } finally {
        setIsLoading(false); 
    } 
  },[]);

  useFocusEffect(
    useCallback(() => { 
      initScreen();
    }, [initScreen])
  );

  const confirmCheckout = async () => {
    Alert.alert("Xác nhận thanh toán", "Bạn có chắc muốn đặt hàng?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đặt hàng",
        onPress: async () => {
          try {
              setIsLoading(true);
              setErrorMessage('');
              await updateData(order.id, "orders", [
                { field: "status", newValue: "pending" },
                { field: "totalPrice", newValue: product?.price ? product.price * order.qty: null },
              ]);
            Alert.alert("✔️ Thành công", "Đơn hàng của bạn đã được đặt!",[{ text: "OK", onPress: ()=>navigation.navigate('History')}]);
          } catch (err:any) {
            setErrorMessage(err.message || 'Unidentified error');
          }finally{
            setIsLoading(false)
          }
        },
      },
    ]);
  };

  if (errorMessage) return <ErrorBlock message={errorMessage} onRetry={initScreen} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>💳 Xác Nhận Thanh Toán</Text>
      <LoadingSpiner visible={isLoading} text="Đang tải..." />
      <View style={styles.card}>
        <Image source={{ uri: product?.image }} style={styles.image} />
        <View style={{ flex: 1 }}>
          <Text style={styles.productName}>{product?.name}</Text>
          <Text style={styles.price}>{formatCurrency(product?.price)}</Text>
          <Text style={styles.qty}>Số lượng: {order?.qty}</Text>
        </View>
        <Text style={styles.totalItem}>{product?.price  && formatCurrency(product.price * order.qty)}</Text>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>Tổng thanh toán:</Text>
        <Text style={styles.summaryPrice}>{product?.price  && formatCurrency(product.price * order.qty)}</Text>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={confirmCheckout}>
        <Text style={styles.payText}>Thanh toán</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.BACKGROUND },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 20, color: COLORS.PRIMARY },

  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },

  image: { width: 80, height: 80, borderRadius: 10, marginRight: 12 },
  productName: { fontSize: 16, fontWeight: "700" },
  price: { color: COLORS.PRICE, marginTop: 4 },
  qty: { marginTop: 6, fontSize: 15 },
  totalItem: { fontWeight: "700", fontSize: 15, color: COLORS.PRIMARY },

  summaryBox: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  summaryText: { fontSize: 18, fontWeight: "700" },
  summaryPrice: { fontSize: 20, fontWeight: "800", marginTop: 6, color: COLORS.PRIMARY },

  payButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 16,
    borderRadius: 14,
    marginTop: 28,
    alignItems: "center",
  },
  payText: { color: COLORS.TEXT_PRIMARY, fontSize: 18, fontWeight: "700" },
});
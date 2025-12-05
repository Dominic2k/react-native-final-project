import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { getAllData, updateData ,selectOrder, deleteData} from "../../database/dbHelpers";
import { Product, Order } from "../../types/Objects";
import ErrorBlock from "../../components/ErrorBlock";
import LoadingSpiner from "../../components/LoadingSpiner";
import { COLORS } from "../../constants/colors";
import { formatCurrency } from "../../utils/formatCurrency";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useNavigation } from '@react-navigation/native'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 
import { BottomTabParamList } from '../../types/Params';

export default function CartScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigation = useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

  const initScreen = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const productsData = await getAllData("products");
      setProducts(productsData);
      const data = await AsyncStorage.getItem('loggedInUser'); 
      if (data) { 
        const curUser = JSON.parse(data); 
        const ordersData = await selectOrder("cart", curUser.id); 
        setOrders(ordersData); 
      } else{ 
        Alert.alert(
            'Chưa đăng nhập', 
            'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', 
            [ 
                { text: 'Hủy', style: 'cancel' }, 
                { text: 'Đăng nhập', onPress: () => navigation.navigate('Login' as never) }, 
            ]
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Unidentified error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      initScreen();
    }, [initScreen])
  );

  const updateQty = async (id: number, type: string) => {
    for (const order of orders) {
      if (order.id === id) {
        if (type === "plus") order.qty += 1;
        else if (type === "minus" && order.qty > 1) order.qty -= 1;

        const updatedOrder = [{ field: "qty", newValue: order.qty }];

        try {
          setIsLoading(true);
          setErrorMessage("");
          await updateData(id, "orders", updatedOrder);
          setOrders((prev) =>
            prev.map((item) => (item.id === id ? { ...item, qty: order.qty } : item))
          );
        } catch (err: any) {
          setErrorMessage(err.message || "Unidentified error");
        } finally {
          setIsLoading(false);
        }

        break;
      }
    }
  };

  const deleteCart = async (id:number)=>{
    Alert.alert("Xác nhận xóa","Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?",[
      {text: "Hủy", style: "cancel"},
      {text: "Xóa",
        onPress: async()=>{
          try{
            setIsLoading(true);
            setErrorMessage('');
            await deleteData(id, "orders");
            setOrders((prev) => prev.filter((item) => item.id !== id));
          }catch (err:any){
            setErrorMessage(err.message || 'Unidentified error');
            }finally{
                setIsLoading(false);
            }
        }
        },
    ]);
  }

  const order = async (id: number) => {
    const selectedOrder = orders.find((order) => order.id === id);
    if (!selectedOrder) return;
    navigation.navigate('HomeTab', {screen: 'Checkout',params: { order: selectedOrder } });
  };
  const calcPrice = (productId: number, qty: number) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.price * qty : 0;
  };

  if (errorMessage)
    return <ErrorBlock message={errorMessage} onRetry={initScreen} />;

  return (
    <ScrollView style={styles.container}>
      <LoadingSpiner visible={isLoading} text="Đang tải..." />

      <Text style={styles.title}>🛒 Giỏ hàng của bạn</Text>

      {orders.length === 0 && (
        <Text style={styles.empty}>Giỏ hàng của bạn đang trống</Text>
      )}

      {orders.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const total = calcPrice(item.productId, item.qty);

        return (
          product && (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: product.image }} style={styles.image} />

              <View style={styles.infoBox}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.price}>{formatCurrency(product.price)}</Text>

                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, "minus")}
                  >
                    <Text style={styles.qtyText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyNumber}>{item.qty}</Text>

                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, "plus")}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.total}>Tổng: {formatCurrency(total)}</Text>
              </View>

              <View style={{ flexDirection: 'column', alignItems: 'flex-end', marginLeft: 8 }}>
                <TouchableOpacity style={styles.buyButton} onPress={()=>order(item.id)}>
                  <Text style={styles.buyButtonText}>Đặt</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={()=>{deleteCart(item.id)}}>
                  <Text style={styles.deleteButtonText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
    color: COLORS.PRIMARY,
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 14,
  },

  infoBox: {
    flex: 1,
    marginLeft: 14,
  },

  productName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
  },

  price: {
    marginTop: 4,
    color: COLORS.PRICE,
    fontSize: 15,
    fontWeight: "600",
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.SECONDARY,
  },

  qtyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
  },

  qtyNumber: {
    marginHorizontal: 14,
    fontSize: 17,
    fontWeight: "600",
  },

  total: {
    marginTop: 10,
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.PRIMARY,
  },

  buyButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  buyButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "700",
    fontSize: 15,
  },

  deleteButton: {
    marginTop: 8,
    backgroundColor: COLORS.SECONDARY,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  deleteButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
    fontSize: 15,
  },
});

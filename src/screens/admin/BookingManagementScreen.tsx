import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Order, Product } from '../../types/Objects';
import { getAllData, updateData } from '../../database/dbHelpers';
import { COLORS, BORDER } from '../../constants/colors';
import { formatCurrency } from '../../utils/formatCurrency';
import LoadingSpiner from '../../components/LoadingSpiner';
import ErrorBlock from '../../components/ErrorBlock';

import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import HeaderMenu from '../../components/HeaderMenu';

const STATUS_LIST = [
  'pending',
  'confirmed',
  'shipping',
  'completed',
  'cancelled',
];

export default function BookingManagementScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentTab, setCurrentTab] = useState('pending'); // Tab đang chọn để lọc
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const navigation = useNavigation<any>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderMenu />,
    });
  }, [navigation]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const initScreen = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const [allOrders, allProducts] = await Promise.all([
        getAllData('orders'),
        getAllData('products'),
      ]);

      setOrders(allOrders);
      setProducts(allProducts);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi không xác định');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      initScreen();
    }, [initScreen]),
  );

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    try {
      setIsLoading(true);
      setErrorMessage('');
      const newOrder = [{ field: 'status', newValue: newStatus }];
      await updateData(selectedOrder.id, 'orders', newOrder);
      setModalVisible(false);
      Alert.alert(
        'Thành công',
        `Đã chuyển đơn hàng sang trạng thái: ${newStatus}`,
      );
      initScreen(); // Load lại dữ liệu
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái');
    } finally {
      setIsLoading(false);
    }
  };

  const openUpdateModal = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const getProduct = (id: number) => products.find(p => p.id === id);

  // Lọc đơn hàng theo Tab hiện tại
  const filteredOrders = orders.filter(
    o => o.status.toLowerCase() === currentTab.toLowerCase(),
  );

  if (errorMessage) {
    return <ErrorBlock message={errorMessage} onRetry={initScreen} />;
  }

  return (
    <View style={styles.container}>
      <LoadingSpiner visible={isLoading} text="Đang xử lý..." />

      <Text style={styles.headerTitle}>🛠 Quản Lý Đơn Hàng</Text>

      <View style={styles.statusRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {STATUS_LIST.map(s => (
            <TouchableOpacity
              key={s}
              style={[
                styles.statusBtn,
                currentTab === s && styles.statusBtnActive,
              ]}
              onPress={() => setCurrentTab(s)}
            >
              <Text
                style={[
                  styles.statusText,
                  currentTab === s && styles.statusTextActive,
                ]}
              >
                {s.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 2. Danh sách đơn hàng */}
      <ScrollView style={{ marginTop: 10 }}>
        {filteredOrders.length === 0 && (
          <Text style={styles.emptyText}>Chưa có đơn hàng nào ở mục này.</Text>
        )}

        {filteredOrders.map(item => {
          const product = getProduct(item.productId);
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Mã đơn: #{item.id}</Text>
                <Text style={styles.dateText}>{'N/A'}</Text>
              </View>

              <View style={styles.cardBody}>
                <Image source={{ uri: product?.image }} style={styles.image} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.name}>
                    {product?.name || 'Sản phẩm đã xóa'}
                  </Text>
                  <Text style={styles.qty}>
                    User ID: {item.userId} | SL: {item.qty}
                  </Text>
                  <Text style={styles.total}>
                    Tổng:{' '}
                    {formatCurrency(
                      item.totalPrice || (product?.price || 0) * item.qty,
                    )}
                  </Text>
                </View>
              </View>

              {/* Nút hành động */}
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => openUpdateModal(item)}
              >
                <Text style={styles.actionBtnText}>🔄 Cập nhật trạng thái</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* 3. Modal chọn trạng thái mới */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Cập nhật trạng thái đơn #{selectedOrder?.id}
            </Text>
            <Text style={{ marginBottom: 10, color: '#666' }}>
              Trạng thái hiện tại: {selectedOrder?.status}
            </Text>

            {STATUS_LIST.map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.modalOption,
                  status === selectedOrder?.status && {
                    backgroundColor: '#f0f0f0',
                    borderColor: COLORS.PRIMARY,
                  },
                ]}
                onPress={() => handleUpdateStatus(status)}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    status === selectedOrder?.status && {
                      color: COLORS.PRIMARY,
                      fontWeight: 'bold',
                    },
                  ]}
                >
                  {status.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.BACKGROUND,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.PRIMARY,
    marginBottom: 15,
    textAlign: 'center',
  },

  // Tabs Style
  statusRow: {
    flexDirection: 'row',
    marginBottom: 10,
    height: 40,
  },
  statusBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
    justifyContent: 'center',
  },
  statusBtnActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  statusTextActive: { color: 'white' },

  // Card Style
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  orderId: {
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },

  cardBody: { flexDirection: 'row' },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2c3e50',
  },
  qty: {
    marginTop: 4,
    fontSize: 13,
    color: '#666',
  },
  total: { marginTop: 4, fontWeight: '700', color: COLORS.PRICE },

  actionBtn: {
    marginTop: 12,
    backgroundColor: COLORS.SECONDARY,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    fontSize: 14,
  },

  emptyText: { textAlign: 'center', marginTop: 40, color: '#888' },

  // Modal Style
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.PRIMARY,
  },
  modalOption: {
    width: '100%',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  closeBtn: {
    marginTop: 15,
    backgroundColor: COLORS.PRICE,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
});

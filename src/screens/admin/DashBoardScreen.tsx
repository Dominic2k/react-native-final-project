import { StyleSheet, Text, View, TouchableOpacity, Alert, DeviceEventEmitter, ScrollView, Dimensions } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderMenu from '../../components/HeaderMenu';
import { COLORS } from '../../constants/colors'; 

const { width } = Dimensions.get('window');

const DASHBOARD_ITEMS = [
  { id: '5', title: 'QL Đơn hàng', subtitle: 'Xử lý đơn đặt', screen: 'BookingManagement', icon: '📦', color: '#e3f2fd', textColor: '#1565c0' },
  { id: '3', title: 'QL Sản phẩm', subtitle: 'Thêm/Sửa/Xóa', screen: 'ProductManagement', icon: '🍔', color: '#e8f5e9', textColor: '#2e7d32' },
  { id: '2', title: 'QL Danh mục', subtitle: 'Phân loại món', screen: 'CategoryManagement', icon: '📂', color: '#fff3e0', textColor: '#ef6c00' },
  { id: '4', title: 'QL Người dùng', subtitle: 'Khách hàng', screen: 'UserManagement', icon: '👥', color: '#f3e5f5', textColor: '#7b1fa2' },
];

const DashBoardScreen = () => {
  const navigation = useNavigation<any>();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Trang Quản Trị',
      headerRight: () => <HeaderMenu />,
      headerStyle: { backgroundColor: COLORS.PRIMARY },
      headerTintColor: '#fff',
    });
  }, [navigation]);

  const handleNavigation = (item: any) => {
    if (item.tab) {
      navigation.navigate(item.tab, { screen: item.screen });
    } else {
      navigation.navigate(item.screen);
    }
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn muốn đăng xuất khỏi hệ thống?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('loggedInUser');
          DeviceEventEmitter.emit('UPDATE_AUTH');
          // Reset về Login để không thể back lại
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* Phần Header Chào mừng */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Xin chào, Admin! 👋</Text>
        <Text style={styles.subText}>Chúc bạn một ngày làm việc hiệu quả.</Text>
      </View>

      {/* Phần Grid Menu */}
      <View style={styles.gridContainer}>
        {DASHBOARD_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { backgroundColor: item.color }]}
            onPress={() => handleNavigation(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <View>
              <Text style={[styles.cardTitle, { color: item.textColor }]}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nút Đăng xuất riêng biệt */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Đăng xuất hệ thống</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

export default DashBoardScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Màu nền sáng nhẹ
  },
  
  // Welcome Section
  welcomeSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    color: '#666',
  },

  // Grid Style
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  card: {
    width: (width - 45) / 2, // Chia đôi màn hình trừ khoảng cách
    height: 140,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'space-between',
    elevation: 3, // Bóng đổ Android
    shadowColor: "#000", // Bóng đổ iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
  },

  // Logout Button
  logoutButton: {
    marginHorizontal: 15,
    marginTop: 20,
    backgroundColor: '#ffebee',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  logoutText: {
    color: '#d32f2f',
    fontWeight: '700',
    fontSize: 16,
  },

  versionText: {
    textAlign: 'center',
    color: '#bbb',
    fontSize: 12,
    marginTop: 20,
  },
})
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert, DeviceEventEmitter } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, BORDER } from '../constants/colors';

const ADMIN_MENU_ITEMS = [
  { id: '1', title: 'Dashboard', screen: 'Dashboard', tab:'AdminTab' },
  { id: '2', title: 'Category Management', screen: 'CategoryManagement', tab:'AdminTab' },
  { id: '3', title: 'Product Management', screen: 'ProductManagement', tab:'AdminTab'  },
  { id: '4', title: 'User Management', screen: 'UserManagement', tab:'AdminTab'  },
  { id: '5', title: 'Order Management', screen: 'BookingManagement', tab:'AdminTab'  },
  { id: '6', title: 'Logout', screen: 'Logout', isDestructive: true },
];

const HeaderMenu = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation<any>(); 

  const handleMenuItemPress = async (item: any) => {
    setVisible(false);
    if (item.screen === 'Logout') {
      Alert.alert('Logout', 'Do you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'OK', 
          onPress: async () => {
            await AsyncStorage.removeItem('loggedInUser');
            DeviceEventEmitter.emit('UPDATE_AUTH');
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        }
      ]);
    } else if (item.tab) {
          // Đi đến Tab Admin, rồi vào màn hình con
          navigation.navigate(item.tab, { screen: item.screen });
      } else {
          navigation.navigate(item.screen);
      }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.menuButton}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setVisible(false)}
        >
          <View style={styles.menuContainer}>
            {ADMIN_MENU_ITEMS.map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={[
                  styles.menuItem, 
                  index < ADMIN_MENU_ITEMS.length - 1 && styles.menuItemBorder
                ]}
                onPress={() => handleMenuItemPress(item)}
              >
                <Text style={[
                  styles.menuText, 
                  item.isDestructive && { color: COLORS.ERROR, fontWeight: '700' }
                ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  menuIcon: {
    fontSize: 24,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    marginTop: 50, 
    marginRight: 10,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 12,
    width: 200,
    elevation: 8,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: BORDER.LIGHT,
  },
  menuItem: { 
    paddingVertical: 14, 
    paddingHorizontal: 18,
  },
  menuItemBorder: { 
    borderBottomWidth: 1, 
    borderBottomColor: BORDER.LIGHT,
  },
  menuText: { 
    fontSize: 16, 
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
});

export default HeaderMenu;
import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabParamList } from '../types/Params';
import HeaderMenu from './HeaderMenu';
const UserHeader = () => {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;
        setUser(currentUser);
        if (currentUser && currentUser.role === 'admin'){
          navigation.setOptions({
          headerRight: () => <HeaderMenu />,
          });
        }else{
          navigation.setOptions({
            headerRight: ()=>null, 
          });
        }
      };
      loadUser();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedInUser');
    setUser(null);
    DeviceEventEmitter.emit('UPDATE_AUTH');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.header}>
      {user ? (
        <>
          {user.username && user.role ? (
            <Text style={styles.userInfo}>
              Xin chào, {String(user.username)} ({String(user.role)})
            </Text>
          ) : null}

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Đăng Xuất</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
    backgroundColor: '#6200ea',
  },
  userInfo: {
    color: 'white',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#ff5252',
    padding: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UserHeader;

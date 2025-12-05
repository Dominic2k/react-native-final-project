import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabParamList } from '../types/Params';
import HeaderMenu from './HeaderMenu';
import { COLORS, BORDER } from '../constants/colors';
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
              Hello, {String(user.username)} ({String(user.role)})
            </Text>
          ) : null}

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
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
    padding: 12,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: BORDER.LIGHT,
  },
  userInfo: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: COLORS.ERROR,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: COLORS.ERROR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoutText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
    fontSize: 13,
  },
});

export default UserHeader;

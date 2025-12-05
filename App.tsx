/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, DeviceEventEmitter } from 'react-native';
import {SafeAreaProvider,useSafeAreaInsets,} from 'react-native-safe-area-context';
import { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { initDatabase } from './src/database/database';
import ErrorBlock from './src/components/ErrorBlock';
import LoadingSpiner from './src/components/LoadingSpiner';
import TabButton from './src/navigation/TabButton';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [errorMessage, setErrorMessage]= useState<string>('')
  const [userRole, setUserRole] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  const checkUserRole = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('loggedInUser');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUserRole(parsedUser.role);
        } else {
          setUserRole(''); // Nếu không có user (đã logout) thì set về rỗng
        }
      } catch (e) {
        console.warn(e);
      }
  };

  useEffect(() => {
    const initData = async () => {
       await checkUserRole();
       setIsReady(true);
    };
    initData();

    // 3. Đăng ký lắng nghe sự kiện "UPDATE_AUTH"
    const listener = DeviceEventEmitter.addListener('UPDATE_AUTH', () => {
        checkUserRole(); 
    });

    // 4. Hủy lắng nghe khi component unmount
    return () => {
        listener.remove();
    }
  }, []);

  const startApp = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');    
      await initDatabase();
    } catch (err: any) {
      setErrorMessage(err.message || 'Unidentified error');
    } finally {
      setIsLoading(false); 
    }
  }, []);

  useEffect(() => {
    startApp();
  }, [startApp]);

  if (errorMessage) {
    return (
      <ErrorBlock 
        message={errorMessage} 
        onRetry={startApp}
      />
    );
  }

  if (isLoading || !isReady) {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
         <LoadingSpiner visible={true} text="Đang tải dữ liệu..." />
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>       
        <TabButton userRole={userRole} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

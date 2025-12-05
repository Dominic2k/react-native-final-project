import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, DeviceEventEmitter } from 'react-native';
import { getUserByCredentials } from '../../database/dbHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabParamList } from '../../types/Params';
import ErrorBlock from '../../components/ErrorBlock';
import LoadingSpiner from '../../components/LoadingSpiner';

const LogInScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading]= useState<boolean>(false);
  const [errorMessage, setErrorMessage]= useState<string>('')

  const navigation = useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (username.length < 5 || password.length < 5) {
      Alert.alert('Lỗi', 'Vui lòng nhập ít nhất 5 ký tự ở các trường!');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const user = await getUserByCredentials(username, password);

      if (user) {
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
        Alert.alert('Thành công', `Xin chào, ${user.username}!`, [
          {
            text: 'OK',
            onPress: () => {
              DeviceEventEmitter.emit('UPDATE_AUTH');
              if(user.role === 'admin') {
                navigation.navigate('AdminTab', {screen: 'Dashboard' });
              } else {    
              navigation.navigate('HomeTab', {screen: 'Home' });
              }
            },
          },
        ]);
      } else {
        Alert.alert('Lỗi', 'Tên đăng nhập hoặc mật khẩu không đúng!');
      }
    } catch (error:any) {
      setErrorMessage(error.message || 'Unidentified error')
    }finally{
      setIsLoading(false);
    }
  };

  if (errorMessage) {
    return (
    <ErrorBlock 
        message={errorMessage} 
        onRetry={() => setErrorMessage('')}
    />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <LoadingSpiner visible={isLoading} text="Đang khởi tạo..." />
      <TextInput
        placeholder="Tên đăng nhập"
        style={styles.input}
        onChangeText={setUsername}
        value={username}
      />

      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.switchText}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20 
  },
  title: { 
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20 
  },
  input: { 
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10 
  },
  button: { 
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 5,
    marginTop: 10 
  },
  buttonText: { 
    color: 'white',
    fontWeight: 'bold' 
  },
  switchText: { 
    marginTop: 15,
    color: '#6200ea' 
  },
});

export default LogInScreen;

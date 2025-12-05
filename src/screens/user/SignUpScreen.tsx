import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { insertData, checkUserExists, getAllData } from '../../database/dbHelpers';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {  BottomTabParamList} from '../../types/Params';
import ErrorBlock from '../../components/ErrorBlock';
import LoadingSpiner from '../../components/LoadingSpiner';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading]= useState<boolean>(false);
  const [errorMessage, setErrorMessage]= useState<string>('');

  const navigation = useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

  const handleSignup = async () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (username.length <5 || password.length <5) {
      Alert.alert('Lỗi', 'Vui lòng nhập ít nhất 6 ký tự cho các trường!');
      return;
    }
    try {
      setIsLoading(true);
      setErrorMessage('');
      const userExists = await checkUserExists(username);
      if (userExists) {
        Alert.alert('Lỗi', 'Tên đăng nhập đã tồn tại!');
        return;
      }
      const users = await getAllData('users');
      const newUser= [
          {field: 'id', newValue: users.length > 0 ? users[users.length -1].id +1 : 1},
          {field: 'username', newValue: username},
          {field: 'password', newValue: password},
          {field: 'role', newValue: role},
      ];
      
      await insertData('users', newUser);
      Alert.alert('Thành công', 'Đăng ký thành công!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);

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
      <LoadingSpiner visible={isLoading} text="Đang khởi tạo..." />
      <Text style={styles.title}>Đăng Ký</Text>
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

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Đăng Ký</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>Đã có tài khoản? Đăng nhập ngay</Text>
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

export default SignUpScreen;

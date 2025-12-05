import React, { useEffect, useState, useCallback } from 'react';
import { View,ScrollView, Text, StyleSheet, TouchableOpacity, TextInput, Alert, DeviceEventEmitter } from 'react-native';
import { COLORS } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types/Objects';
import { updateData } from '../../database/dbHelpers';
import ErrorBlock from '../../components/ErrorBlock';
import LoadingSpiner from '../../components/LoadingSpiner';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [errorMessage, setErrorMessage]= useState<string>('');

  // State đổi mật khẩu
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showForm, setShowForm] = useState(false);

  const initScreen = useCallback(async ()=>{
    try{
        setIsLoading(true);
        setErrorMessage('');
        const data = await AsyncStorage.getItem('loggedInUser');
        if (data) setUser(JSON.parse(data));
    }catch (err: any){
        setErrorMessage(err.message || 'Unidentified error');
    }finally {
        setIsLoading(false); 
    }
  },[]);

  useEffect(() => {
    initScreen();
  }, [initScreen]);


  const handleLogout = async () => {
    try{
        setIsLoading(true);
        setErrorMessage('');
        await AsyncStorage.removeItem('loggedInUser');
        setUser(null);
        DeviceEventEmitter.emit('UPDATE_AUTH');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }catch (err: any){
        setErrorMessage(err.message || 'Unidentified error');
    }finally {
        setIsLoading(false); 
    }
    
  };

  const handleChangePassword = async () => {
    if (!user) return;

    if (oldPw !== user.password) {
      Alert.alert("Sai mật khẩu", "Mật khẩu hiện tại không đúng");
      return;
    }

    if (newPw.length < 4) {
      Alert.alert("Lỗi", "Mật khẩu mới ít nhất 4 ký tự");
      return;
    }

    if (newPw !== confirmPw) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    // cập nhật mật khẩu
    const updatedUser = { ...user, password: newPw };
    try{
      const newUserData = [
        { field: 'password', newValue: newPw }
      ];
      await updateData(user.id, 'users', newUserData);
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setOldPw("");
      setNewPw("");
      setConfirmPw("");
      setShowForm(false);
      Alert.alert("Thành công", "Đổi mật khẩu thành công");
    }catch(err:any){
      setErrorMessage(err.message || 'Unidentified error')
    }finally{
      setIsLoading(false);
    }
  };

  if (errorMessage) return <ErrorBlock message={errorMessage} onRetry={initScreen} />;
  
  if (isLoading) return <LoadingSpiner visible={isLoading} text="Đang tải..." />;

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16 }}>Không tìm thấy tài khoản</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Thông tin tài khoản</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{user.username}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Password:</Text>
          <Text style={styles.value}>••••••••</Text>
        </View>

        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={styles.changePwText}>
            {showForm ? "Ẩn thay đổi mật khẩu" : "Thay đổi mật khẩu"}
          </Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <Text style={styles.label}>Vai trò:</Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>
      </View>

      {/* FORM ĐỔI MẬT KHẨU */}
      {showForm && (
        <View style={styles.card}>

          <Text style={styles.formTitle}>Đổi mật khẩu</Text>

          <TextInput
            placeholder="Mật khẩu hiện tại"
            secureTextEntry
            style={styles.input}
            value={oldPw}
            onChangeText={setOldPw}
          />

          <TextInput
            placeholder="Mật khẩu mới"
            secureTextEntry
            style={styles.input}
            value={newPw}
            onChangeText={setNewPw}
          />

          <TextInput
            placeholder="Xác nhận mật khẩu mới"
            secureTextEntry
            style={styles.input}
            value={confirmPw}
            onChangeText={setConfirmPw}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleChangePassword}>
            <Text style={styles.saveText}>Lưu thay đổi</Text>
          </TouchableOpacity>

        </View>
      )}

      {user.role === 'user' && (
        <TouchableOpacity style={styles.historyBtn} onPress={()=>navigation.navigate('HomeTab', { screen: 'History' })}>
          <Text style={styles.logoutText}>Xem lịch sử đơn hàng</Text>
        </TouchableOpacity>
      )
      }
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng Xuất</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: 20,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: COLORS.TEXT_PRIMARY,
  },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 25,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },

  value: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
  },

  changePwText: {
    fontSize: 15,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    marginTop: -5,
    marginBottom: 15,
  },

  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: COLORS.TEXT_PRIMARY,
  },

  input: {
    backgroundColor: '#f3f3f3',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 15,
  },

  saveBtn: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },

  saveText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '700',
  },

  logoutBtn: {
    backgroundColor: COLORS.SECONDARY,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  historyBtn: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  logoutText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
    fontSize: 16,
  },
});

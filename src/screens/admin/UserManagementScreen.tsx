import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import { View,ScrollView, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllData , updateData, deleteData} from '../../database/dbHelpers';
import { User } from '../../types/Objects';
import ErrorBlock from '../../components/ErrorBlock';
import LoadingSpiner from '../../components/LoadingSpiner';
import { COLORS } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import HeaderMenu from '../../components/HeaderMenu';


const UserManagementScreen = () => {
  const [users,setUsers]= useState<User[]>([]);
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [errorMessage, setErrorMessage]= useState<string>('');
  const navigation = useNavigation<any>();

  useLayoutEffect(() => {
        navigation.setOptions({
        headerRight: () => <HeaderMenu />,
        });
    }, [navigation]);
  const initScreen = useCallback(async ()=>{
    try{
        setIsLoading(true);
        setErrorMessage('');
        const usersData = await getAllData('users');
        setUsers(usersData)
    }catch(err: any){
        setErrorMessage(err.message || 'Unidentified error')
    }finally{
        setIsLoading(false);
    }
  },[])

  useFocusEffect(
      useCallback(() => {
        initScreen();
      }, [initScreen]  
    )
  );


  const handleChangeRole = (id: number) => {
    Alert.alert('Đổi quyền', 
      `Bạn có chắc muốn đổi quyền user #${id}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đồng ý', onPress: async () => {
            for(const user of users){
              if(user.id === id){
                const newRole = user.role === 'admin' ? 'user' : 'admin';
                const updatedFields = [
                  { field: 'role', newValue: newRole },
                ];
                try{
                  setIsLoading(true);
                  setErrorMessage('');
                  await updateData(id, 'users', updatedFields);
                  const updatedUsers = getAllData('users');
                  setUsers(await updatedUsers);
                  Alert.alert('Thành công', `Quyền user #${id} đã được đổi!`);
                }catch(err: any){
                  setErrorMessage(err.message || 'Unidentified error')
                }finally{
                  setIsLoading(false);
                  break;
                }
              }
            }
          } 
        },
      ]);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Xóa tài khoản',
       `Bạn có chắc muốn xóa user #${id}?`,
      [
        { text: 'Hủy', style: 'cancel' },   
        { text: 'Đồng ý', onPress: async () => {
            for(const user of users){
              if(user.id === id){
                const updatedFields = [
                  { field: 'isDeleted', newValue: 1 },
                ];
                try{
                  setIsLoading(true);
                  setErrorMessage('');
                  await deleteData(id, 'users');
                  const updatedUsers = getAllData('users');
                  setUsers(await updatedUsers);
                  Alert.alert('Thành công', `User #${id} đã được xóa!`);
                }catch(err: any){
                  setErrorMessage(err.message || 'Unidentified error')
                }finally{
                  setIsLoading(false);
                  break;
                }
              }
            }
          }
        },
      ]);
  };

  if (errorMessage) {
    return (
    <ErrorBlock 
        message={errorMessage} 
        onRetry={initScreen}
    />
    );
  }
  return (
  <ScrollView style={styles.container}>
    <LoadingSpiner visible={isLoading} text="Đang khởi tạo..." />
    <Text style={styles.header}>Quản Lý Người Dùng</Text>

    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={styles.card}>

          {/* Header row */}
          <View style={styles.row}>
            <Text style={styles.avatar}>👤</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.username}</Text>
              <Text style={styles.password}>🔑 Mật khẩu: {item.password}</Text>
            </View>
          </View>

          {/* Role badge */}
          <Text style={styles.role}>
            🛡 Quyền: {item.role.toUpperCase()}
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.buttonEdit]}
              onPress={() => handleChangeRole(item.id)}
            >
              <Text style={styles.buttonText}>Đổi quyền</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonDelete]}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.buttonText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  </ScrollView>
);

};

export default UserManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.BACKGROUND,
  },

  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: COLORS.TEXT_PRIMARY,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  avatar: {
    fontSize: 30,
    marginRight: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },

  password: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },

  role: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',

    backgroundColor: '#eef2ff',
    color: '#4f46e5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    borderRadius: 6,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonEdit: {
    backgroundColor: COLORS.PRIMARY,
    marginRight: 8,
  },

  buttonDelete: {
    backgroundColor: COLORS.SECONDARY,
    marginLeft: 8,
  },

  buttonText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
  },
});

import React, { useEffect, useState, useCallback } from 'react';
import { View,ScrollView, Text, StyleSheet, TouchableOpacity, TextInput, Alert, DeviceEventEmitter } from 'react-native';
import { COLORS, BORDER } from '../../constants/colors';
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
      Alert.alert("Wrong Password", "Current password is incorrect");
      return;
    }

    if (newPw.length < 4) {
      Alert.alert("Error", "New password must be at least 4 characters");
      return;
    }

    if (newPw !== confirmPw) {
      Alert.alert("Error", "Password confirmation does not match");
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
      Alert.alert("Success", "Password changed successfully");
    }catch(err:any){
      setErrorMessage(err.message || 'Unidentified error')
    }finally{
      setIsLoading(false);
    }
  };

  if (errorMessage) return <ErrorBlock message={errorMessage} onRetry={initScreen} />;
  
  if (isLoading) return <LoadingSpiner visible={isLoading} text="Loading..." />;

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16 }}>Account not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Account Information</Text>

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
            {showForm ? "Hide Change Password" : "Change Password"}
          </Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>
      </View>

      {/* CHANGE PASSWORD FORM */}
      {showForm && (
        <View style={styles.card}>

          <Text style={styles.formTitle}>Change Password</Text>

          <TextInput
            placeholder="Current Password"
            secureTextEntry
            style={styles.input}
            value={oldPw}
            onChangeText={setOldPw}
          />

          <TextInput
            placeholder="New Password"
            secureTextEntry
            style={styles.input}
            value={newPw}
            onChangeText={setNewPw}
          />

          <TextInput
            placeholder="Confirm New Password"
            secureTextEntry
            style={styles.input}
            value={confirmPw}
            onChangeText={setConfirmPw}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleChangePassword}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>

        </View>
      )}

      {user.role === 'user' && (
        <TouchableOpacity style={styles.historyBtn} onPress={()=>navigation.navigate('HomeTab', { screen: 'History' })}>
          <Text style={styles.logoutText}>View Order History</Text>
        </TouchableOpacity>
      )
      }
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
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
    backgroundColor: COLORS.CARD_BG,
    padding: 20,
    borderRadius: 16,
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: BORDER.LIGHT,
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
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: BORDER.LIGHT,
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
    backgroundColor: COLORS.ERROR,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.ERROR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
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

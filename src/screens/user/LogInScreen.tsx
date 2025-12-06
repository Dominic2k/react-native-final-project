import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import { getUserByCredentials } from '../../database/dbHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabParamList } from '../../types/Params';
import ErrorBlock from '../../components/ErrorBlock';
import LoadingSpiner from '../../components/LoadingSpiner';
import { COLORS, BORDER } from '../../constants/colors';

const LogInScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const navigation =
    useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

  const handleLogin = async () => {
    setErrorMessage('');

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // --- Validate cơ bản ---
    if (!trimmedUsername || !trimmedPassword) {
      Alert.alert('Error', 'Please fill in all fields!');
      return;
    }

    // Không chứa khoảng trắng
    if (/\s/.test(trimmedUsername)) {
      Alert.alert('Error', 'Username cannot contain spaces!');
      return;
    }

    // Username chỉ gồm chữ + số
    if (!/^[A-Za-z0-9]+$/.test(trimmedUsername)) {
      Alert.alert('Error', 'Username can only contain letters and numbers!');
      return;
    }

    if (trimmedUsername.length < 5) {
      Alert.alert('Error', 'Username must be at least 5 characters!');
      return;
    }

    // Password mạnh hơn một chút (giống login của app thật)
    if (trimmedPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters!');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      const user = await getUserByCredentials(trimmedUsername, trimmedPassword);

      if (user) {
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));

        Alert.alert('Success', `Hello, ${user.username}!`, [
          {
            text: 'OK',
            onPress: () => {
              DeviceEventEmitter.emit('UPDATE_AUTH');

              if (user.role === 'admin') {
                navigation.navigate('AdminTab', { screen: 'Dashboard' });
              } else {
                navigation.navigate('HomeTab', { screen: 'Home' });
              }
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Username or password is incorrect!');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Unidentified error');
    } finally {
      setIsLoading(false);
    }
  };

  if (errorMessage) {
    return (
      <ErrorBlock message={errorMessage} onRetry={() => setErrorMessage('')} />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>💻</Text>
        <Text style={styles.title}>TechStore</Text>
        <Text style={styles.subtitle}>Login</Text>
      </View>
      <LoadingSpiner visible={isLoading} text="Loading..." />
      <View style={styles.form}>
        <TextInput
          placeholder="Username"
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          style={styles.input}
          onChangeText={setUsername}
          value={username}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          style={styles.input}
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.switchText}>
            Don't have an account? Sign up now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER.LIGHT,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: COLORS.CARD_BG,
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    elevation: 4,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  buttonText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  switchText: {
    marginTop: 20,
    color: COLORS.SECONDARY,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LogInScreen;

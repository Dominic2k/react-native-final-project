import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  insertData,
  checkUserExists,
  getAllData,
} from '../../database/dbHelpers';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabParamList } from '../../types/Params';
import ErrorBlock from '../../components/ErrorBlock';
import LoadingSpiner from '../../components/LoadingSpiner';
import { COLORS, BORDER } from '../../constants/colors';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const navigation =
    useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

  const handleSignup = async () => {
    // Reset lỗi trước khi validate
    setErrorMessage('');

    // Trim để tránh ký tự trắng đầu/cuối
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // --- Validate username ---
    if (!trimmedUsername || !trimmedPassword) {
      Alert.alert('Error', 'Please fill in all fields!');
      return;
    }

    // Không để khoảng trắng
    if (/\s/.test(trimmedUsername)) {
      Alert.alert('Error', 'Username cannot contain spaces!');
      return;
    }

    // Username chỉ gồm chữ và số
    if (!/^[A-Za-z0-9]+$/.test(trimmedUsername)) {
      Alert.alert('Error', 'Username can only contain letters and numbers!');
      return;
    }

    if (trimmedUsername.length < 5) {
      Alert.alert('Error', 'Username must be at least 5 characters!');
      return;
    }

    // --- Validate password ---
    if (trimmedPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters!');
      return;
    }

    // Password mạnh hơn (ít nhất 1 hoa, 1 thường, 1 số)
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!strongPasswordRegex.test(trimmedPassword)) {
      Alert.alert(
        'Weak Password',
        'Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
      );
      return;
    }

    if (trimmedPassword.toLowerCase().includes(trimmedUsername.toLowerCase())) {
      Alert.alert('Error', 'Password cannot contain your username!');
      return;
    }

    try {
      setIsLoading(true);

      const userExists = await checkUserExists(trimmedUsername);
      if (userExists) {
        Alert.alert('Error', 'Username already exists!');
        return;
      }

      const users = await getAllData('users');
      const newUser = [
        {
          field: 'id',
          newValue: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        },
        { field: 'username', newValue: trimmedUsername },
        { field: 'password', newValue: trimmedPassword },
        { field: 'role', newValue: role },
      ];

      await insertData('users', newUser);

      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
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
        <Text style={styles.subtitle}>Sign Up</Text>
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

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.switchText}>
            Already have an account? Login now
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

export default SignUpScreen;

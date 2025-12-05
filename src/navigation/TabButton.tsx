import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppNavigatorHome from './AppNavigatorHome';
import AppNavigatorAdmin from './AppNavigatorAdmin';
import SignUpScreen from '../screens/user/SignUpScreen';
import LogInScreen from '../screens/user/LogInScreen';
import { BottomTabParamList } from '../types/Params';
import ProfileScreen from '../screens/user/ProfileScreen';
import CartScreen from '../screens/user/CartScreen';
import { COLORS, BORDER } from '../constants/colors';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabButton = ({ userRole }: { userRole: string }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.CARD_BG,
          borderTopWidth: 1,
          borderTopColor: BORDER.LIGHT,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
      initialRouteName="HomeTab"
    >
      <Tab.Screen
        name="HomeTab"
        component={AppNavigatorHome as React.ComponentType<any>}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size + 4, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="AdminTab"
        component={AppNavigatorAdmin as React.ComponentType<any>}
        options={{
          title: 'Admin',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size + 4, color }}>⚙️</Text>
          ),
          tabBarButton: userRole === 'admin' ? undefined : () => null,
          tabBarItemStyle:
            userRole === 'admin' ? undefined : { display: 'none' },
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size + 4, color }}>🛒</Text>
          ),
          tabBarButton:
            userRole && userRole === 'user' ? undefined : () => null,
          tabBarItemStyle:
            userRole && userRole === 'user' ? undefined : { display: 'none' },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size + 4, color }}>👤</Text>
          ),
          tabBarButton: userRole ? undefined : () => null,
          tabBarItemStyle: userRole ? undefined : { display: 'none' },
        }}
      />
      <Tab.Screen
        name="Login"
        component={LogInScreen}
        options={{
          title: 'Login',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size + 4, color }}>🔐</Text>
          ),
          tabBarButton: userRole ? () => null : undefined,
          tabBarItemStyle: userRole ? { display: 'none' } : undefined,
        }}
      />
      <Tab.Screen
        name="Signup"
        component={SignUpScreen}
        options={{
          title: 'Sign Up',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size + 4, color }}>📝</Text>
          ),
          tabBarButton: userRole ? () => null : undefined,
          tabBarItemStyle: userRole ? { display: 'none' } : undefined,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabButton;

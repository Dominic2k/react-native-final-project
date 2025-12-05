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

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabButton = ({userRole}:{userRole:string}) => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName='HomeTab'
    >
      <Tab.Screen
        name="HomeTab"
        component={AppNavigatorHome as React.ComponentType<any>}
        options={{ title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
         }}
      />
      <Tab.Screen
        name="AdminTab"
        component={AppNavigatorAdmin as React.ComponentType<any>}
        options={{ title: 'Admin',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
          tabBarButton: userRole === 'admin' ? undefined : () => null,
          tabBarItemStyle: userRole === 'admin' ? undefined : { display: 'none' },
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🛒</Text>
          ),
          tabBarButton: (userRole && userRole === 'user') ? undefined : ()=>null,
          tabBarItemStyle: (userRole && userRole === 'user') ? undefined : { display: 'none' } ,
         }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>👤</Text>
          ),
          tabBarButton: userRole ? undefined : ()=>null,
          tabBarItemStyle: userRole ? undefined : { display: 'none' } ,
         }}
      />
      <Tab.Screen
        name="Login"
        component={LogInScreen}
        options={{ title: 'Login',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🔒</Text>
          ),
          tabBarButton: userRole ? ()=>null : undefined,
          tabBarItemStyle: userRole ? { display: 'none' } : undefined ,
         }}
      />
      <Tab.Screen
        name="Signup"
        component={SignUpScreen}
        options={{ title: 'Signup',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>➕</Text> 
          ),
          tabBarButton: userRole ? ()=>null : undefined,
          tabBarItemStyle: userRole ? { display: 'none' } : undefined ,
         }}
      />
    </Tab.Navigator>
  );
};

export default TabButton;
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/Params';
import HomeScreen from '../screens/user/HomeScreen';
import ProductDetailScreen from '../screens/user/ProductDetailScreen';
import AboutScreen from '../screens/user/AboutScreen';
import ProductScreen from '../screens/user/ProductScreen';
import CheckoutScreen from '../screens/user/CheckoutScreen';
import HistoryScreen from '../screens/user/HistoryScreen';


const Stack = createNativeStackNavigator<HomeStackParamList>();

const AppNavigatorHome = () => {
  return (
    <Stack.Navigator 
      initialRouteName='Home'
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detail" component={ProductDetailScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Products" component={ProductScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
}
export default AppNavigatorHome;
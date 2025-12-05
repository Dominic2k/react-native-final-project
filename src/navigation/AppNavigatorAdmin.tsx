import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { AdminStackParamList } from '../types/Params';
import DashBoardScreen from '../screens/admin/DashBoardScreen';
import ProductManagementScreen from '../screens/admin/ProductManagementScreen';
import ProductDetail from '../screens/admin/ProductDetailScreen';
import CategoryManagementScreen from '../screens/admin/CategoryManagementScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import BookingManagementScreen from '../screens/admin/BookingManagementScreen';



const Stack = createNativeStackNavigator<AdminStackParamList>();

const AppNavigatorAdmin = () => {
  return (
    <Stack.Navigator 
      initialRouteName='ProductManagement'
    >
      <Stack.Screen name="Dashboard" component={DashBoardScreen} />
      <Stack.Screen name="ProductManagement" component={ProductManagementScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="CategoryManagement" component={CategoryManagementScreen} />
      <Stack.Screen name="UserManagement" component={UserManagementScreen} />
      <Stack.Screen name="BookingManagement" component={BookingManagementScreen} />
    </Stack.Navigator>
  );
}
export default AppNavigatorAdmin;
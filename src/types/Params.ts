import { Product,Order } from './Objects';
import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabParamList = {
  AdminTab: NavigatorScreenParams<AdminStackParamList>;
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  Signup: undefined; 
  Login: undefined;
  Profile: undefined;
  Cart: undefined;
};

export type HomeStackParamList = {
    Home: undefined;
    Detail: {product: Product};
    Products:{ categoryId?: number };
    About:undefined;
    History: undefined;
    Checkout: {order: Order};
};

export type AdminStackParamList = {  
    Dashboard: undefined;
    CategoryManagement: undefined;
    ProductManagement: {categoryId?: number};
    ProductDetail: { product: Product }; 
    UserManagement: undefined;
    BookingManagement: undefined;
}
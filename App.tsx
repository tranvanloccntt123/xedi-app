import './global.css';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RealmContext } from '@/src/contexts/RealmContext';
import { store, persistor } from '@/src/store';
import { MainTab } from '@/src/navigation/MainTab';
import LoginScreen from '@/src/screens/LoginScreen';
import RegisterScreen from '@/src/screens/RegisterScreen';
import BookingScreen from '@/src/screens/BookingScreen';
import ConfirmationScreen from '@/src/screens/ConfirmationScreen';
import { TripRequestScreen } from '@/src/screens/TripRequestScreen';
import { TripRequestForFixedRouteScreen } from '@/src/screens/TripRequestForFixedRouteScreen';
import { UserProfileScreen } from '@/src/screens/UserProfileScreen';
import { VehicleRegistrationScreen } from '@/src/screens/VehicleRegistrationScreen';
import { RouteName, RouteParamsList } from '@/src/types/route';

const Stack = createStackNavigator<RouteParamsList>();

export default function App() {
  return (
    <RealmContext.RealmProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GluestackUIProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <NavigationContainer>
                <Stack.Navigator initialRouteName={RouteName.Login}>
                  <Stack.Screen 
                    name={RouteName.Login} 
                    component={LoginScreen} 
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name={RouteName.Register} component={RegisterScreen} />
                  <Stack.Screen 
                    name={RouteName.MainTab} 
                    component={MainTab}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name={RouteName.Booking} component={BookingScreen} />
                  <Stack.Screen name={RouteName.Confirmation} component={ConfirmationScreen} />
                  <Stack.Screen name={RouteName.TripRequest} component={TripRequestScreen} />
                  <Stack.Screen name={RouteName.TripRequestForFixedRoute} component={TripRequestForFixedRouteScreen} />
                  <Stack.Screen name={RouteName.UserProfile} component={UserProfileScreen} />
                  <Stack.Screen name={RouteName.VehicleRegistration} component={VehicleRegistrationScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </PersistGate>
          </Provider>
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </RealmContext.RealmProvider>
  );
}


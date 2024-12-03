import 'nativewind/css';
import './global.css';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Realm from 'realm';
import { realmConfig } from '@/src/models/RealmModels';
import { store, persistor } from '@/src/store';
import HomeScreen from '@/src/screens/HomeScreen';
import LoginScreen from '@/src/screens/LoginScreen';
import BookingScreen from '@/src/screens/BookingScreen';
import ConfirmationScreen from '@/src/screens/ConfirmationScreen';
import BookingsHistoryScreen from '@/src/screens/BookingsHistoryScreen';
import { TripRequestScreen } from '@/src/screens/TripRequestScreen';
import { TripRequestForFixedRouteScreen } from '@/src/screens/TripRequestForFixedRouteScreen';
import { UserProfileScreen } from '@/src/screens/UserProfileScreen';
import { VehicleRegistrationScreen } from '@/src/screens/VehicleRegistrationScreen';
import { RouteName, RouteParamsList } from '@/src/types/route';

const Stack = createStackNavigator<RouteParamsList>();

export default function App() {
  const [realm, setRealm] = useState<Realm | null>(null);

  useEffect(() => {
    const initRealm = async () => {
      try {
        const realmInstance = await Realm.open(realmConfig);
        setRealm(realmInstance);
      } catch (error) {
        console.error('Failed to open Realm', error);
      }
    };

    initRealm();

    return () => {
      if (realm) {
        realm.close();
      }
    };
  }, []);

  if (!realm) {
    // You might want to show a loading screen here
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider config={config}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName={RouteName.Login}>
                <Stack.Screen name={RouteName.Login} component={LoginScreen} />
                <Stack.Screen name={RouteName.Home} component={HomeScreen} />
                <Stack.Screen name={RouteName.Booking} component={BookingScreen} />
                <Stack.Screen name={RouteName.Confirmation} component={ConfirmationScreen} />
                <Stack.Screen name={RouteName.BookingsHistory} component={BookingsHistoryScreen} />
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
  );
}


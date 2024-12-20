import "./global.css";
import React from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import { RealmContext } from "@/src/contexts/RealmContext";
import { store, persistor } from "@/src/store";
import { RootState } from "@/src/store";
import { RouteName, RouteParamsList } from "@/src/types/route";

import BookingScreen from "@/src/screens/BookingScreen";
import ConfirmationScreen from "@/src/screens/ConfirmationScreen";
import CreateFixedRouteScreen from "@/src/screens/CreateFixedRouteScreen";
import LoginScreen from "@/src/screens/LoginScreen";
import RegisterScreen from "@/src/screens/RegisterScreen";
import RoleSelectionScreen from "@/src/screens/RoleSelectionScreen";
import { TripRequestForFixedRouteScreen } from "@/src/screens/TripRequestForFixedRouteScreen";
import { TripRequestScreen } from "@/src/screens/TripRequestScreen";
import TripRequestDetailsScreen from "@/src/screens/TripRequestDetailsScreen";
import { UserProfileScreen } from "@/src/screens/UserProfileScreen";
import { VehicleRegistrationScreen } from "@/src/screens/VehicleRegistrationScreen";
import { MainTab } from "@/src/navigation/MainTab";

const Stack = createStackNavigator<RouteParamsList>();

const linking: LinkingOptions<RouteParamsList> = {
  prefixes: ["xediapp://", "https://xediapp.com"],
  config: {
    screens: {
      [RouteName.Login]: "login",
      [RouteName.Register]: "register",
      [RouteName.MainTab]: {
        screens: {
          [RouteName.Home]: "home",
          [RouteName.BookingsHistory]: "bookings-history",
          [RouteName.Settings]: "settings",
        },
      },
      [RouteName.Booking]: "booking",
      [RouteName.Confirmation]: "confirmation/:bookingId",
      [RouteName.TripRequest]: "trip-request",
      [RouteName.TripRequestForFixedRoute]:
        "trip-request-fixed-route/:fixedRouteId/:customerId",
      [RouteName.UserProfile]: "user-profile/:userId",
      [RouteName.VehicleRegistration]: "vehicle-registration/:driverId",
      [RouteName.CreateFixedRoute]: "create-fixed-route",
      [RouteName.TripRequestDetails]: "trip-request-details/:requestId",
    },
  },
};

const Navigator = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          animation: "fade",
        }}
      >
        {!user ? (
          <Stack.Group>
            <Stack.Screen
              name={RouteName.Login}
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={RouteName.RoleSelection}
              component={RoleSelectionScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={RouteName.Register}
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen
              name={RouteName.MainTab}
              component={MainTab}
              options={{ headerShown: false }}
            />
            <Stack.Screen name={RouteName.Booking} component={BookingScreen} />
            <Stack.Screen
              name={RouteName.Confirmation}
              component={ConfirmationScreen}
            />
            <Stack.Screen
              name={RouteName.TripRequest}
              component={TripRequestScreen}
            />
            <Stack.Screen
              name={RouteName.TripRequestForFixedRoute}
              component={TripRequestForFixedRouteScreen}
            />
            <Stack.Screen
              name={RouteName.UserProfile}
              component={UserProfileScreen}
            />
            <Stack.Screen
              name={RouteName.VehicleRegistration}
              component={VehicleRegistrationScreen}
            />
            <Stack.Screen
              name={RouteName.CreateFixedRoute}
              component={CreateFixedRouteScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={RouteName.TripRequestDetails}
              component={TripRequestDetailsScreen}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <RealmContext.RealmProvider>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor={"transparent"}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GluestackUIProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Navigator />
            </PersistGate>
          </Provider>
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </RealmContext.RealmProvider>
  );
}

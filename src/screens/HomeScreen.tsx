import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "@/src/components/ui/button";
import { VStack } from "@/src/components/ui/vstack";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { Box } from "@/src/components/ui/box";
import { RootState } from "@/src/store";
import { logout } from "@/src/features/auth/authSlice";
import { RouteName, RouteParamsList } from "@/src/types/route";

type HomeScreenNavigationProp = StackNavigationProp<
  RouteParamsList,
  RouteName.Home
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate(RouteName.Login);
  };

  return (
    <Box className="flex-1 justify-center items-center p-6 bg-gray-100">
      <VStack space="md" className="w-full max-w-md">
        <Heading size="xl" className="text-3xl font-bold mb-6 text-blue-600">
          Welcome, {user?.name}!
        </Heading>
        <Button
          onPress={() => navigation.navigate(RouteName.Booking)}
          className="w-full bg-blue-500 py-3 rounded-md mb-4"
        >
          <Text className="text-white font-semibold">Book a Ride</Text>
        </Button>
        <Button
          onPress={() => navigation.navigate(RouteName.BookingsHistory)}
          className="w-full bg-green-500 py-3 rounded-md mb-4"
        >
          <Text className="text-white font-semibold">View Booking History</Text>
        </Button>
        <Button
          variant="outline"
          onPress={handleLogout}
          className="w-full border border-neutral-200 border-red-500 py-3 rounded-md dark:border-neutral-800"
        >
          <Text className="text-red-500 font-semibold">Logout</Text>
        </Button>
      </VStack>
    </Box>
  );
}

import React from "react";
import { Box } from "@/src/components/ui/box";
import { Text } from "@/src/components/ui/text";
import { Heading } from "@/src/components/ui/heading";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { IFixedRoute } from "@/src/types";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { router } from "expo-router";

interface FixedRoutesListProps {
  searchQuery: string;
}

export default function FixedRoutesList({ searchQuery }: FixedRoutesListProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const fixedRoutes = useSelector(
    (state: RootState) => state.fixedRoutes.routes
  );

  const filteredRoutes = fixedRoutes.filter(
    (route) =>
      route.driverId === user?.id &&
      (route.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.endLocation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderItem = (item: IFixedRoute) => (
    <Box key={item.id} className="bg-white p-4 mb-2 rounded-md shadow-sm w-full">
      <Text className="font-bold">
        {item.startLocation} to {item.endLocation}
      </Text>
      <Text>Departure: {new Date(item.departureTime).toLocaleString()}</Text>
      <Text>
        Available Seats: {item.availableSeats}/{item.totalSeats}
      </Text>
      <Text>Price: {item.price.toLocaleString()} VND</Text>
    </Box>
  );

  if (filteredRoutes.length === 0) {
    return (
      <Box className="w-full">
        <Heading size="md" className="mb-2">
          Your Fixed Routes
        </Heading>
        <Text>No fixed routes found. Add a new route to get started!</Text>
        <Button
          size="sm"
          className="mt-4 bg-blue-500 w-full"
          onPress={() => router.navigate("create-fixed-route")}
        >
          <ButtonText className="text-white">Add New Route</ButtonText>
        </Button>
      </Box>
    );
  }

  return (
    <Box className="w-full">
      <Heading size="md" className="mb-2">
        Your Fixed Routes
      </Heading>
      {filteredRoutes.map((item) => renderItem(item))}
      <Button
        size="sm"
        className="mt-4 bg-blue-500 w-full"
        onPress={() => router.navigate("create-fixed-route")}
      >
        <ButtonText className="text-white">Add New Route</ButtonText>
      </Button>
    </Box>
  );
}


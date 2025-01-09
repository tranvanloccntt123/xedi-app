const APP_STRUCT = "CREATE_FIXED_ROUTE_SCREEN";

import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Heading } from "@/src/components/ui/heading";
import { Input } from "@/src/components/ui/input";
import { InputField } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import {
  FormControl,
  FormControlLabel,
} from "@/src/components/ui/form-control";
import { useDispatch, useSelector } from "react-redux";
import { addFixedRoute } from "@/src/store/fixedRoutesSlice";
import { RootState } from "@/src/store/store";
import { useRouter } from "expo-router";
import DateTimePicker from "@/src/components/DateTime";
import { IFixedRoute } from "@/src/types";

export default function CreateFixedRoute() {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [departureTime, setDepartureTime] = useState(new Date());
  const [totalSeats, setTotalSeats] = useState("");
  const [price, setPrice] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleCreateRoute = () => {
    if (user) {
      const newRoute: IFixedRoute = {
        id: Date.now().toString(),
        driverId: user.id || "",
        startLocation,
        endLocation,
        departureTime: departureTime.toISOString(),
        totalSeats: parseInt(totalSeats, 10),
        availableSeats: parseInt(totalSeats, 10),
        price: parseFloat(price),
        createdAt: new Date(),
      };
      dispatch(addFixedRoute(newRoute));
      router.back();
    }
  };

  const onChangeDepartureTime = (date: Date) => {
    // const currentDate = selectedDate || departureTime;
    // setShowDatePicker(false);
    // setDepartureTime(currentDate);
  };

  return (
    <Box className="flex-1 bg-gray-100">
      <ScrollView>
        <Box className="p-4">
          <Heading size="xl" className="mb-6">
            Create Fixed Route
          </Heading>
          <VStack space="md">
            <FormControl>
              <FormControlLabel>Start Location</FormControlLabel>
              <Input>
                <InputField
                  placeholder="Enter start location"
                  value={startLocation}
                  onChangeText={setStartLocation}
                />
              </Input>
            </FormControl>

            <FormControl>
              <FormControlLabel>End Location</FormControlLabel>
              <Input>
                <InputField
                  placeholder="Enter end location"
                  value={endLocation}
                  onChangeText={setEndLocation}
                />
              </Input>
            </FormControl>

            <FormControl>
              <FormControlLabel>Departure Time</FormControlLabel>
              <Button onPress={() => setShowDatePicker(true)}>
                <ButtonText>{departureTime.toLocaleString()}</ButtonText>
              </Button>
              {showDatePicker && (
                <DateTimePicker
                  date={departureTime}
                  // mode="datetime"
                  // display="default"
                  onChangeDate={onChangeDepartureTime}
                />
              )}
            </FormControl>

            <FormControl>
              <FormControlLabel>Total Seats</FormControlLabel>
              <Input>
                <InputField
                  placeholder="Enter total seats"
                  value={totalSeats}
                  onChangeText={setTotalSeats}
                  keyboardType="numeric"
                />
              </Input>
            </FormControl>

            <FormControl>
              <FormControlLabel>Price</FormControlLabel>
              <Input>
                <InputField
                  placeholder="Enter price"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </Input>
            </FormControl>

            <Button size="lg" className="mt-4" onPress={handleCreateRoute}>
              <ButtonText>Create Route</ButtonText>
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
}

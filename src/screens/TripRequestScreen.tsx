import React, { useState } from "react";
import { View } from "react-native";
import { useRealm } from "@/src/hooks/useRealm";
import { TripRequest } from "@/src/models/RealmModels";
import { Button } from "@/src/components/ui/button";
import { Input, InputField } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem
} from "@/src/components/ui/select";

export function TripRequestScreen() {
  const realm = useRealm();
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [departureTime, setDepartureTime] = useState(new Date());

  const submitTripRequest = () => {
    realm.write(() => {
      realm.create("TripRequest", {
        _id: new Realm.BSON.ObjectId(),
        customerId: new Realm.BSON.ObjectId(), // This should be the actual logged-in user's ID
        startLocation,
        endLocation,
        departureTime,
        status: "pending",
        requestTime: new Date(),
        updatedAt: new Date(),
      });
    });
    // Navigate back or show confirmation
  };

  return (
    <View className="flex-1 p-4">
      <VStack space="md">
        <Text className="text-xl font-bold">Request a Trip</Text>
        <Input>
          <InputField
            placeholder="Start Location"
            value={startLocation}
            onChangeText={setStartLocation}
          />
        </Input>
        <Input>
          <InputField
            placeholder="End Location"
            value={endLocation}
            onChangeText={setEndLocation}
          />
        </Input>
        <Select
          onValueChange={(value) => setDepartureTime(new Date(value))}
        >
          <SelectTrigger variant="outline" size="md">
            <SelectInput placeholder="Select Departure Time" />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {[...Array(24)].map((_, index) => (
                <SelectItem
                  key={index}
                  label={`${index}:00`}
                  value={new Date().setHours(index, 0, 0, 0).toString()}
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
        <Button onPress={submitTripRequest}>
          <Text>Submit Trip Request</Text>
        </Button>
      </VStack>
    </View>
  );
}


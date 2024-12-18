import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from "@/src/components/ui/button";
import { Input, InputField } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import { useRealm } from '@/src/hooks/useRealm';
import { FixedRoute } from '@/src/models/RealmModels';
import { RouteName, RouteParamsList } from '@/src/types/route';
import AppStyles from "@/src/themes/styles";
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

type CreateFixedRouteScreenNavigationProp = StackNavigationProp<RouteParamsList, RouteName.CreateFixedRoute>;

export default function CreateFixedRouteScreen() {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [departureTime, setDepartureTime] = useState(new Date());
  const [totalSeats, setTotalSeats] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  const navigation = useNavigation<CreateFixedRouteScreenNavigationProp>();
  const realm = useRealm();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSubmit = () => {
    setError('');

    if (!startLocation || !endLocation || !totalSeats || !price) {
      setError('Please fill in all fields');
      return;
    }

    if (isNaN(Number(totalSeats)) || isNaN(Number(price))) {
      setError('Total seats and price must be numbers');
      return;
    }

    realm.write(() => {
      realm.create('FixedRoute', {
        _id: new Realm.BSON.ObjectId(),
        driverId: new Realm.BSON.ObjectId(user?._id),
        startLocation,
        endLocation,
        departureTime,
        totalSeats: parseInt(totalSeats),
        availableSeats: parseInt(totalSeats),
        price: parseFloat(price),
        createdAt: new Date(),
      });
    });

    navigation.goBack();
  };

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView style={AppStyles.container}>
        <Box className="flex-1 bg-white p-6">
          <Text className="text-left text-2xl font-bold mb-6">Create Fixed Route</Text>
          <VStack space="md">
            <Input style={AppStyles.input}>
              <InputField 
                placeholder="Start Location" 
                value={startLocation} 
                onChangeText={setStartLocation}
              />
            </Input>
            <Input style={AppStyles.input}>
              <InputField 
                placeholder="End Location" 
                value={endLocation} 
                onChangeText={setEndLocation}
              />
            </Input>
            <Text>Departure Time:</Text>
            <DateTimePicker
              value={departureTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || departureTime;
                setDepartureTime(currentDate);
              }}
            />
            <Input style={AppStyles.input}>
              <InputField 
                placeholder="Total Seats" 
                value={totalSeats} 
                onChangeText={setTotalSeats}
                keyboardType="numeric"
              />
            </Input>
            <Input style={AppStyles.input}>
              <InputField 
                placeholder="Price" 
                value={price} 
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </Input>
            <Button onPress={handleSubmit} className="bg-blue-500 rounded" style={AppStyles.btn}>
              <Text className="text-white font-bold">Create Fixed Route</Text>
            </Button>
            {error ? (
              <Text className="text-red-500 text-center mt-2">{error}</Text>
            ) : null}
          </VStack>
        </Box>
      </SafeAreaView>
    </Box>
  );
}


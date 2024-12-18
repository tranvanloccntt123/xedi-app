import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRealm } from '@/src/hooks/useRealm';
import { TripRequest } from '@/src/models/RealmModels';
import { Button } from "@/src/components/ui/button";
import { Input, InputField } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '@/src/components/ui/select';
import { RouteName, RouteParamsList } from '@/src/types/route';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyles from '../themes/styles';

type TripRequestScreenNavigationProp = StackNavigationProp<RouteParamsList, RouteName.TripRequest>;

export function TripRequestScreen() {
  const realm = useRealm();
  const navigation = useNavigation<TripRequestScreenNavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [departureTime, setDepartureTime] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  const submitTripRequest = () => {
    if (!startLocation || !endLocation) {
      setError('Please fill in all fields');
      return;
    }

    try {
      realm.write(() => {
        realm.create('TripRequest', {
          _id: new Realm.BSON.ObjectId(),
          customerId: new Realm.BSON.ObjectId(user?._id),
          startLocation,
          endLocation,
          departureTime,
          status: 'pending',
          requestTime: new Date(),
          updatedAt: new Date(),
        });
      });
      navigation.goBack();
    } catch (e) {
      setError('Failed to submit trip request. Please try again.');
    }
  };

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView style={AppStyles.container}>
        <Box className="flex-1 bg-gray-100 p-6">
          <VStack space="md">
            <Text className="text-2xl font-bold mb-4">Request a Trip</Text>
            <Input className="bg-white rounded-md">
              <InputField
                placeholder="Start Location"
                value={startLocation}
                onChangeText={setStartLocation}
              />
            </Input>
            <Input className="bg-white rounded-md">
              <InputField
                placeholder="End Location"
                value={endLocation}
                onChangeText={setEndLocation}
              />
            </Input>
            <Text className="text-lg font-semibold mb-2">Departure Time:</Text>
            <DateTimePicker
              value={departureTime}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || departureTime;
                setDepartureTime(currentDate);
              }}
            />
            <Button onPress={submitTripRequest} className="bg-blue-500 rounded-md mt-4">
              <Text className="text-white font-semibold">Submit Trip Request</Text>
            </Button>
            {error && <Text className="text-red-500 mt-2">{error}</Text>}
          </VStack>
        </Box>
      </SafeAreaView>
    </Box>
  );
}


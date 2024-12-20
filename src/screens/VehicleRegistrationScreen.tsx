import React, { useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRealm } from '@/src/hooks/useRealm';
import { Vehicle } from '@/src/models/RealmModels';
import { Button } from "@/src/components/ui/button";
import { Input, InputField } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import { Card } from "@/src/components/ui/card";
import { RouteName, RouteParamsList } from '@/src/types/route';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyles from '@/src/themes/styles';

type VehicleRegistrationScreenRouteProp = RouteProp<RouteParamsList, RouteName.VehicleRegistration>;
type VehicleRegistrationScreenNavigationProp = StackNavigationProp<RouteParamsList, RouteName.VehicleRegistration>;

export function VehicleRegistrationScreen() {
  const realm = useRealm();
  const [licensePlate, setLicensePlate] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [capacity, setCapacity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<VehicleRegistrationScreenNavigationProp>();
  const route = useRoute<VehicleRegistrationScreenRouteProp>();
  const { driverId } = route.params;

  const validateInputs = () => {
    if (!licensePlate || !model || !capacity) {
      setError('Please fill in all required fields');
      return false;
    }
    if (isNaN(parseInt(capacity, 10)) || parseInt(capacity, 10) <= 0) {
      setError('Capacity must be a positive number');
      return false;
    }
    return true;
  };

  const registerVehicle = () => {
    setError(null);
    if (!validateInputs()) return;

    try {
      realm.write(() => {
        realm.create('Vehicle', {
          _id: new Realm.BSON.ObjectId(),
          driverId: new Realm.BSON.ObjectId(driverId),
          licensePlate,
          model,
          color,
          capacity: parseInt(capacity, 10),
          createdAt: new Date(),
        });
      });
      navigation.goBack();
    } catch (e) {
      setError('Failed to register vehicle. Please try again.');
    }
  };

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView style={AppStyles.container}>
        <Box className="flex-1 bg-gray-100 p-6">
          <Card className="mb-6 p-4">
            <Text className="text-2xl font-bold text-blue-600 mb-4">Register Vehicle</Text>
            <VStack space="md">
              <Input className="bg-white rounded-md">
                <InputField
                  placeholder="License Plate*"
                  value={licensePlate}
                  onChangeText={setLicensePlate}
                />
              </Input>
              <Input className="bg-white rounded-md">
                <InputField
                  placeholder="Model*"
                  value={model}
                  onChangeText={setModel}
                />
              </Input>
              <Input className="bg-white rounded-md">
                <InputField
                  placeholder="Color"
                  value={color}
                  onChangeText={setColor}
                />
              </Input>
              <Input className="bg-white rounded-md">
                <InputField
                  placeholder="Capacity*"
                  value={capacity}
                  onChangeText={setCapacity}
                  keyboardType="numeric"
                />
              </Input>
            </VStack>
          </Card>
          {!!error && <Text className="text-red-500 mb-4">{error}</Text>}
          <Button onPress={registerVehicle} className="bg-blue-500 rounded-md">
            <Text className="text-white font-semibold">Register Vehicle</Text>
          </Button>
        </Box>
      </SafeAreaView>
    </Box>
  );
}


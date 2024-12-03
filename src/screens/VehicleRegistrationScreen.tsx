import React, { useState } from 'react';
import { View } from 'react-native';
import { useRealm } from '@/src/hooks/useRealm';
import { Vehicle } from '@/src/models/RealmModels';
import { Button, Input, Text, VStack } from '@gluestack-ui/themed';

export function VehicleRegistrationScreen({ route }) {
  const realm = useRealm();
  const [licensePlate, setLicensePlate] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [capacity, setCapacity] = useState('');
  const { driverId } = route.params;

  const registerVehicle = () => {
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
    // Navigate back or show confirmation
  };

  return (
    <View className="flex-1 <View className="flex-1 p-4">"
      <VStack space="md">
        <Text className="text-xl font-bold">Register Vehicle</Text>
        <Input
          placeholder="License Plate"
          value={licensePlate}
          onChangeText={setLicensePlate}
        />
        <Input
          placeholder="Model"
          value={model}
          onChangeText={setModel}
        />
        <Input
          placeholder="Color"
          value={color}
          onChangeText={setColor}
        />
        <Input
          placeholder="Capacity"
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="numeric"
        />
        <Button onPress={registerVehicle}>
          <Text>Register Vehicle</Text>
        </Button>
      </VStack>
    </View>
  );
}


import React, { useState } from 'react';
import { Modal } from 'react-native';
import { Box } from '@/src/components/ui/box';
import { Button } from '@/src/components/ui/button';
import { ButtonText } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { InputField } from '@/src/components/ui/input';
import { VStack } from '@/src/components/ui/vstack';
import { Text } from '@/src/components/ui/text';
import { useDispatch, useSelector } from 'react-redux';
import { addFixedRoute } from '@/src/store/fixedRoutesSlice';
import { RootState } from '@/src/store/store';

interface AddFixedRouteModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function AddFixedRouteModal({ isVisible, onClose }: AddFixedRouteModalProps) {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [price, setPrice] = useState('');

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSubmit = () => {
    if (user) {
      const newRoute = {
        id: Date.now().toString(),
        driverId: user.id,
        startLocation,
        endLocation,
        departureTime: new Date(departureTime).toISOString(),
        totalSeats: parseInt(totalSeats, 10),
        availableSeats: parseInt(totalSeats, 10),
        price: parseFloat(price),
        createdAt: new Date(),
      };
      dispatch(addFixedRoute(newRoute));
      onClose();
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <Box className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <Box className="bg-white p-4 rounded-md w-5/6">
          <Text className="text-xl font-bold mb-4">Add Fixed Route</Text>
          <VStack space="md">
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
            <Input>
              <InputField
                placeholder="Departure Time (YYYY-MM-DD HH:MM)"
                value={departureTime}
                onChangeText={setDepartureTime}
              />
            </Input>
            <Input>
              <InputField
                placeholder="Total Seats"
                value={totalSeats}
                onChangeText={setTotalSeats}
                keyboardType="numeric"
              />
            </Input>
            <Input>
              <InputField
                placeholder="Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </Input>
            <Button onPress={handleSubmit}>
              <ButtonText>Add Route</ButtonText>
            </Button>
            <Button variant="outline" onPress={onClose}>
              <ButtonText>Cancel</ButtonText>
            </Button>
          </VStack>
        </Box>
      </Box>
    </Modal>
  );
}


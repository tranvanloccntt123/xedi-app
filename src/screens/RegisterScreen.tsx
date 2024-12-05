import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from "@/src/components/ui/button";
import { Input, InputField } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem
} from "@/src/components/ui/select";
import { useRealm } from '@/src/hooks/useRealm';
import { User } from '@/src/models/RealmModels';
import Realm from 'realm';
import { RouteName, RouteParamsList } from '@/src/types/route';
import AppStyles from "@/src/themes/styles";

type RegisterScreenNavigationProp = StackNavigationProp<RouteParamsList, RouteName.Register>;

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'driver'>('customer');
  const [error, setError] = useState('');
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const realm = useRealm();

  const handleRegister = () => {
    setError('');
    if (!name || !phone || !password) {
      setError('All fields are required');
      return;
    }

    const existingUser = realm.objects<User>('User').filtered('phone = $0', phone)[0];
    if (existingUser) {
      setError('A user with this phone number already exists');
      return;
    }

    realm.write(() => {
      const newUser = realm.create<User>('User', {
        _id: new Realm.BSON.ObjectId(),
        name,
        phone,
        password, // In a real app, you should hash the password before storing
        role,
        createdAt: new Date(),
      });
      navigation.navigate(RouteName.Home, { userId: newUser._id.toHexString() });
    });
  };

  return (
    <Box className="flex-1 justify-center p-6 bg-gray-100">
      <VStack space="md" className="bg-white p-8 rounded-lg shadow-md items-center justify-center">
        <Text className="text-3xl font-bold mb-6 text-blue-600">Register</Text>
        <Input style={AppStyles.input}>
          <InputField 
            placeholder="Name" 
            value={name} 
            onChangeText={setName}
          />
        </Input>
        <Input style={AppStyles.input}>
          <InputField 
            placeholder="Phone Number" 
            value={phone} 
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </Input>
        <Input style={AppStyles.input}>
          <InputField 
            placeholder="Password" 
            value={password} 
            onChangeText={setPassword}
            secureTextEntry
          />
        </Input>
        <Select
          selectedValue={role}
          onValueChange={(value) => setRole(value as 'customer' | 'driver')}
        >
          <SelectTrigger variant="outline" size="md" className="w-full mb-4 p-3 border-gray-300 rounded-md">
            <SelectInput placeholder="Select Role" />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="Customer" value="customer" />
              <SelectItem label="Driver" value="driver" />
            </SelectContent>
          </SelectPortal>
        </Select>
        <Button onPress={handleRegister} className="w-full bg-blue-500 rounded-md">
          <Text className="text-white font-semibold">Register</Text>
        </Button>
        {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}
        <Button variant="outline" onPress={() => navigation.navigate(RouteName.Login)} className="w-full mt-4 border-blue-500 rounded-md">
          <Text className="text-blue-500">Back to Login</Text>
        </Button>
      </VStack>
    </Box>
  );
}


import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input, Text, VStack, Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from '@gluestack-ui/themed';
import { useRealm } from '@/src/hooks/useRealm';
import { User } from '@/src/models/RealmModels';
import { RouteName, RouteParamsList } from '@/src/types/route';

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
    <View style={styles.container}>
      <VStack space="md" alignItems="center">
        <Text fontSize="2xl" fontWeight="bold">Register</Text>
        <Input
          placeholder="Name"
          value={name}
          onChangeText={setName}
          width="100%"
        />
        <Input
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          width="100%"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          width="100%"
        />
        <Select
          selectedValue={role}
          onValueChange={(value) => setRole(value as 'customer' | 'driver')}
          width="100%"
        >
          <SelectTrigger>
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
        <Button onPress={handleRegister} width="100%">
          <Text color="white">Register</Text>
        </Button>
        {error ? <Text color="red">{error}</Text> : null}
        <Button variant="outline" onPress={() => navigation.navigate(RouteName.Login)} width="100%">
          <Text>Back to Login</Text>
        </Button>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});


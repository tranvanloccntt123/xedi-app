import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input, Text, VStack } from '@gluestack-ui/themed';
import { useRealm } from '@/src/hooks/useRealm';
import { User } from '@/src/models/RealmModels';
import { RouteName, RouteParamsList } from '@/src/types/route';

type LoginScreenNavigationProp = StackNavigationProp<RouteParamsList, RouteName.Login>;

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation<StackNavigationProp<RouteParamsList, RouteName.Login>>();
  const realm = useRealm();

  const validateVietnamesePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^(0|\+84)(\s?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])(\d)(\s?\d{3})(\s?\d{3})$/;
    return phoneRegex.test(phoneNumber);
  };

  const validatePassword = (pass: string) => {
    return pass.length >= 8 && pass.length <= 20 && !/\s/.test(pass);
  };

  const handleLogin = () => {
    setError('');

    if (!validateVietnamesePhoneNumber(phone)) {
      setError('Invalid phone number format');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be 8-20 characters long and contain no spaces');
      return;
    }

    const user = realm.objects<User>('User').filtered('phone = $0', phone)[0];

    if (user && user.password === password) {
      // In a real app, you should use proper password hashing and verification
      navigation.navigate(RouteName.Home, { userId: user._id.toHexString() });
    } else {
      setError('Invalid phone number or password');
    }
  };

  return (
    <View style={styles.container}>
      <VStack space="md" alignItems="center">
        <Text fontSize="2xl" fontWeight="bold">Login</Text>
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
        <Button onPress={handleLogin} width="100%">
          <Text color="white">Login</Text>
        </Button>
        {error ? <Text color="red">{error}</Text> : null}
        <Button variant="outline" onPress={() => navigation.navigate(RouteName.Register)} width="100%">
          <Text>Don't have an account? Register</Text>
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


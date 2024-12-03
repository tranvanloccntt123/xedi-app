import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "@/src/components/ui/button";
import { Input, InputField } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import { useRealm, useQuery } from "@/src/hooks/useRealm";
import { User } from "@/src/models/RealmModels";
import { RouteName, RouteParamsList } from "@/src/types/route";

type LoginScreenNavigationProp = StackNavigationProp<RouteParamsList, RouteName.Login>;

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const realm = useRealm();
  const users = useQuery<User>("User");

  const validateVietnamesePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^(0|\+84)(\s?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])(\d)(\s?\d{3})(\s?\d{3})$/;
    return phoneRegex.test(phoneNumber);
  };

  const validatePassword = (pass: string) => {
    return pass.length >= 8 && pass.length <= 20 && !/\s/.test(pass);
  };

  const handleLogin = () => {
    setError("");

    if (!validateVietnamesePhoneNumber(phone)) {
      setError("Invalid phone number format");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be 8-20 characters long and contain no spaces");
      return;
    }

    const user = users.filtered("phone = $0", phone)[0];

    if (user && user.password === password) {
      // In a real app, you should use proper password hashing and verification
      navigation.navigate(RouteName.Home, { userId: user._id.toHexString() });
    } else {
      setError("Invalid phone number or password");
    }
  };

  return (
    <Box className="flex-1 justify-center p-6 bg-gray-100">
      <VStack space="md" className="bg-white p-8 rounded-lg shadow-md">
        <Text className="text-3xl font-bold mb-6 text-blue-600">Login</Text>
        <Input>
          <InputField 
            placeholder="Phone Number" 
            value={phone} 
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </Input>
        <Input>
          <InputField 
            placeholder="Password" 
            value={password} 
            onChangeText={setPassword}
            secureTextEntry
          />
        </Input>
        <Button onPress={handleLogin} className="w-full bg-blue-500 py-3 rounded-md">
          <Text className="text-white font-semibold">Login</Text>
        </Button>
        {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}
        <Button variant="outline" onPress={() => navigation.navigate(RouteName.Register)} className="w-full mt-4 border border-neutral-200 border-blue-500 py-3 rounded-md dark:border-neutral-800">
          <Text className="text-blue-500">Don't have an account? Register</Text>
        </Button>
      </VStack>
    </Box>
  );
}


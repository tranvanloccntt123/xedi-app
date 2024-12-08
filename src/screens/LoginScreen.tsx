import React, { useState } from "react";
import { View } from "react-native";
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
import AppStyles from "@/src/themes/styles";
import { validateVietnamesePhoneNumber, validatePassword, PHONE_NUMBER_EXAMPLES } from "@/src/utils/validation";

type LoginScreenNavigationProp = StackNavigationProp<
  RouteParamsList,
  RouteName.Login
>;

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const realm = useRealm();
  const users = useQuery<User>("User");

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
      // In a real-world scenario, you should use a secure password hashing method
      // and compare hashed passwords instead of plain text
      navigation.navigate(RouteName.MainTab);
    } else {
      setError("Invalid phone number or password");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-6">
      <Box className="w-full bg-white rounded-lg shadow-md p-8">
        <VStack space="md">
          <Text className="text-2xl font-bold mb-6 text-center text-gray-800">
            Login
          </Text>
          <Input style={AppStyles.input}>
            <InputField
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </Input>
          <Text className="text-xs text-gray-500 mt-1">
            Example formats: {PHONE_NUMBER_EXAMPLES.join(", ")}
          </Text>
          <Input style={AppStyles.input}>
            <InputField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </Input>
          <Button
            onPress={handleLogin}
            className="bg-blue-500 hover:bg-blue-700 rounded"
          >
            <Text className="text-white font-bold px-4">Login</Text>
          </Button>
          {error ? (
            <Text className="text-red-500 text-center mt-2">{error}</Text>
          ) : null}
          <Button
            variant="outline"
            onPress={() => navigation.navigate(RouteName.Register)}
            className="mt-4 border-blue-500 rounded"
          >
            <Text className="text-blue-500 px-4">
              Don't have an account? Register
            </Text>
          </Button>
        </VStack>
      </Box>
    </View>
  );
}


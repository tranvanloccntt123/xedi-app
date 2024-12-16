import React, { useState } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "@/src/components/ui/button";
import { Input, InputField } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import { useRealm } from "@/src/hooks/useRealm";
import { User } from "@/src/models/RealmModels";
import Realm from "realm";
import { RouteName, RouteParamsList } from "@/src/types/route";
import AppStyles from "@/src/themes/styles";
import {
  validateName,
  validateVietnamesePhoneNumber,
  validatePassword,
  PHONE_NUMBER_EXAMPLES,
} from "@/src/utils/validation";

type RegisterScreenNavigationProp = StackNavigationProp<
  RouteParamsList,
  RouteName.Register
>;
type RegisterScreenRouteProp = RouteProp<RouteParamsList, RouteName.Register>;

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const realm = useRealm();
  const route = useRoute<RegisterScreenRouteProp>();
  const { role } = route.params;

  const handleRegister = () => {
    setError("");

    if (!validateName(name)) {
      setError("Name must be between 2 and 50 characters");
      return;
    }

    if (!validateVietnamesePhoneNumber(phone)) {
      setError("Invalid phone number format");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be 8-20 characters long and contain no spaces");
      return;
    }

    const existingUser = realm
      .objects<User>("User")
      .filtered("phone = $0", phone)[0];
    if (existingUser) {
      setError("A user with this phone number already exists");
      return;
    }

    realm.write(() => {
      const newUser = realm.create<User>("User", {
        _id: new Realm.BSON.ObjectId(),
        name,
        phone,
        password, // In a real app, you should hash the password before storing
        role,
        createdAt: new Date(),
      });
      navigation.navigate(RouteName.Home);
    });
  };

  return (
    <Box className="flex-1 bg-white p-6">
      <Text className="text-left text-2xl font-bold mb-3">Bắt đầu xedi</Text>
      <Text className="text-sm text-gray-600 mb-6">
        Đăng kí ngay đặt xe liền tay
      </Text>
      <VStack space="md" className="mt-5">
        <Input style={AppStyles.input}>
          <InputField placeholder="Name" value={name} onChangeText={setName} />
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
        <Button
          onPress={handleRegister}
          className="w-full bg-blue-500 rounded-md"
          style={AppStyles.btn}
        >
          <Text className="text-white font-semibold">Register</Text>
        </Button>
        {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}
      </VStack>
      <Box className="flex-1 justify-end items-center mb-6">
        <Text onPress={() => navigation.navigate(RouteName.Login)}>
          Quay lại đăng nhập
        </Text>
      </Box>
    </Box>
  );
}

import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "@/src/components/ui/button";
import { Input, InputField } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useRealm, useQuery } from "@/src/hooks/useRealm";
import { User } from "@/src/models/RealmModels";
import { RouteName, RouteParamsList } from "@/src/types/route";
import {
  validateVietnamesePhoneNumber,
  validatePassword,
} from "@/src/utils/validation";
import AppStyles from "../themes/styles";

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
      navigation.navigate(RouteName.MainTab);
    } else {
      setError("Invalid phone number or password");
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-left text-2xl font-bold mb-3">Lên xedi</Text>
      <Text className="text-sm text-gray-600 mb-6">
        Đăng nhập xedi ngay thôi nào
      </Text>
      <VStack space="md" className="mt-5">
        <Input style={AppStyles.input}>
          <InputField
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </Input>
        <Input style={AppStyles.input}>
          <InputField
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </Input>
        <Button
          onPress={handleLogin}
          className="bg-blue-500 rounded"
          style={AppStyles.btn}
        >
          <Text className="text-white font-bold">Đăng nhập</Text>
        </Button>
        {error ? (
          <Text className="text-red-500 text-center mt-2">{error}</Text>
        ) : null}
      </VStack>
      <View className="flex-1 justify-end items-center mb-6">
        <Text>
          Vui lòng{" "}
          <Text
            className="text-blue-500"
            onPress={() => navigation.navigate(RouteName.RoleSelection)}
          >
            Tạo tài khoản
          </Text>{" "}
          nếu bạn chưa có tài khoản
        </Text>
      </View>
    </View>
  );
}


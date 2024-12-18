import React, { useState } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch } from "react-redux";
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
import { loginSuccess } from "@/src/features/auth/authSlice";
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const dispatch = useDispatch();

  const handleRegister = () => {
    setError("");

    if (!validateName(name)) {
      setError("Tên phải từ 2 đến 50 ký tự");
      return;
    }

    if (!validateVietnamesePhoneNumber(phone)) {
      setError("Số điện thoại không hợp lệ");
      return;
    }

    if (!validatePassword(password)) {
      setError("Mật khẩu phải từ 8-20 ký tự và không chứa khoảng trắng");
      return;
    }

    const existingUser = realm
      .objects<User>("User")
      .filtered("phone = $0", phone)[0];
    if (existingUser) {
      setError("Số điện thoại này đã được đăng ký");
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

      // Create a plain object with user data to store in Redux
      const userForRedux = {
        _id: newUser._id.toHexString(),
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
        vehicleId: newUser.vehicleId?.toHexString(),
        totalRatings: newUser.totalRatings,
        averageRating: newUser.averageRating,
        createdAt: newUser.createdAt.toISOString(),
      };

      // Dispatch the loginSuccess action to store the user in Redux
      dispatch(loginSuccess(userForRedux as never));
    });
  };

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView style={AppStyles.container}>
        <Box className="flex-1 p-6">
          <Text className="text-left text-2xl font-bold mb-3">Bắt đầu xedi</Text>
          <Text className="text-sm text-gray-600 mb-6">
            Đăng ký ngay đặt xe liền tay
          </Text>
          <VStack space="md" className="mt-5">
            <Input style={AppStyles.input}>
              <InputField placeholder="Họ tên" value={name} onChangeText={setName} />
            </Input>
            <Input style={AppStyles.input}>
              <InputField
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </Input>
            <Text className="text-xs text-gray-500 mt-1 mb-2">
              Ví dụ: {PHONE_NUMBER_EXAMPLES.join(", ")}
            </Text>
            <Input style={AppStyles.input}>
              <InputField
                placeholder="Mật khẩu"
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
              <Text className="text-white font-semibold">Đăng ký</Text>
            </Button>
            {error ? <Text className="text-red-500 mt-2 text-center">{error}</Text> : null}
          </VStack>
          <Box className="flex-1 justify-end items-center mb-6">
            <Text 
              onPress={() => navigation.navigate(RouteName.Login)}
              className="text-blue-500 font-semibold"
            >
              Quay lại đăng nhập
            </Text>
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  );
}


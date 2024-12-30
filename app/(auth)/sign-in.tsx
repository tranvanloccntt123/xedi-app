import React, { useState } from "react";
import { Box } from "@/src/components/ui/box";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { FormControl } from "@/src/components/ui/form-control";
import { Heading } from "@/src/components/ui/heading";
import { Input } from "@/src/components/ui/input";
import { InputField } from "@/src/components/ui/input";
import { VStack } from "@/src/components/ui/vstack";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../../src/store/authSlice";
import { setUser } from "../../src/store/userSlice";
import { Text } from "@/src/components/ui/text";
import { HStack } from "@/src/components/ui/hstack";
import { Link, useRouter } from "expo-router";
import { findUser } from "@/src/utils";
import {
  formValidatePerField,
  formValidateSuccess,
} from "@/src/utils/validator";
import { authValidator } from "@/src/constants/validator";

export default function SignIn() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState<Record<string, string>>({
    phone: "",
    password: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = () => {
    const validateForm = formValidatePerField(authValidator, {
      phone,
      password,
    });
    setError({
      phone: validateForm.phone.message,
      password: validateForm.password.message,
    });
    if (!formValidateSuccess(validateForm)) {
      return;
    }
    const user = findUser(phone, password);
    if (user) {
      dispatch(setUser(user));
      dispatch(setAuthenticated(user));
      router.replace("/");
    } else {
      setErrorMessage("Số điện thoại hoặc mật khẩu không đúng");
    }
  };

  return (
    <Box className="flex-1 bg-white">
      <HStack className="flex-1 flex-col lg:flex-row">
        <VStack
          space="xl"
          className="w-full h-full lg:w-3/12 p-4 lg:p-8 z-10 bg-white"
        >
          <VStack space="xs" className="mb-6">
            <Heading size="2xl">Đăng nhập Xedi</Heading>
            <Text>Lên xe ngay đi</Text>
          </VStack>
          <FormControl className="mb-2 w-full" isInvalid={!!error.phone}>
            <Text className="mb-2 text-sm font-medium text-gray-700">
              Số điện thoại
            </Text>
            <Input variant="outline" size="md">
              <InputField
                placeholder="Nhập số điện thoại"
                value={phone}
                onChangeText={(value) => {
                  setPhone(value);
                  setErrorMessage("");
                }}
                keyboardType="phone-pad"
              />
            </Input>
            {!!error.phone && (
              <Text className="text-red-500 text-sm mt-1">{error.phone}</Text>
            )}
          </FormControl>
          <FormControl className="mb-6 w-full" isInvalid={!!error.password}>
            <Text className="mb-2 text-sm font-medium text-gray-700">
              Mật khẩu
            </Text>
            <Input variant="outline" size="md">
              <InputField
                placeholder="Nhập mật khẩu"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  setErrorMessage("");
                }}
                secureTextEntry
              />
            </Input>
            {!!error.password && (
              <Text className="text-red-500 text-sm mt-1">
                {error.password}
              </Text>
            )}
          </FormControl>
          {errorMessage && (
            <Text className="text-red-500 mb-4">{errorMessage}</Text>
          )}
          <Button
            size="lg"
            className="w-full bg-blue-500"
            onPress={handleLogin}
            disabled={!phone.trim() || !password.trim()}
          >
            <ButtonText className="text-white">Đăng nhập</ButtonText>
          </Button>
          <Text className="text-center mt-4">
            Chưa có tài khoản?{" "}
            <Link href="/sign-up" className="text-blue-500">
              Đăng ký
            </Link>
          </Text>
        </VStack>
        <VStack
          space="md"
          className="w-full lg:w-9/12 absolute lg:relative z-0 h-full bg-primary-200 p-4 lg:p-8 items-center justify-center"
        >
          <Heading size="xl" className="text-center mb-4">
            Chào mừng đến với Xedi
          </Heading>
          <Text className="text-center mb-4">
            Ứng dụng đặt xe và giao đồ ăn hàng đầu Việt Nam
          </Text>
          <VStack space="md" className="items-center">
            <Text className="font-bold">Tính năng nổi bật:</Text>
            <Text>✓ Đặt xe nhanh chóng</Text>
            <Text>✓ Giao đồ ăn tiện lợi</Text>
            <Text>✓ Thanh toán an toàn</Text>
            <Text>✓ Ưu đãi hấp dẫn mỗi ngày</Text>
          </VStack>
        </VStack>
      </HStack>
    </Box>
  );
}

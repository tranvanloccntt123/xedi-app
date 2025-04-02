const APP_STRUCT = "SIGN_IN_SCREEN";

import React from "react";
import { useState } from "react";
import { Box } from "@/src/components/ui/box";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { FormControl } from "@/src/components/ui/form-control";
import { Heading } from "@/src/components/ui/heading";
import { Input } from "@/src/components/ui/input";
import { InputField } from "@/src/components/ui/input";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import { Link } from "expo-router";
import {
  formValidatePerField,
  formValidateSuccess,
} from "@/src/utils/validator";
import { authValidator } from "@/src/constants/validator";
import { supabase } from "@/src/lib/supabase";
import { pattern } from "@/src/constants";
import PasswordInput from "@/src/components/PasswordInput";
import { Image } from "react-native";

export default function SignIn() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState<Record<string, string>>({
    phone: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const validateForm = formValidatePerField(authValidator, {
        phone,
        password,
      });
      setError({
        phone: validateForm.phone?.message || "",
        password: validateForm.password?.message || "",
      });
      if (!formValidateSuccess(validateForm)) {
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${phone}${pattern}`,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("An unexpected error occurred");
    }
  };

  return (
    <Box className="flex-1 bg-white">
      <VStack
        space="xl"
        className="flex-1 w-full p-4 bg-white items-center justify-center"
      >
        <VStack className="w-full max-w-md">
          <VStack space="xs" className="mb-6">
            <Heading size="2xl">Đăng nhập Xedi</Heading>
            <Text>Lên xe ngay đi</Text>
          </VStack>
          <FormControl className="w-full mb-1" isInvalid={!!error.phone}>
            <Text className="mb-2 text-md font-medium text-gray-700">
              Số điện thoại
            </Text>
            <Input variant="outline" size="md" className="h-[45px]">
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
          <FormControl className="w-full mb-6" isInvalid={!!error.password}>
            <Text className="mb-2 text-md font-medium text-gray-700">
              Mật khẩu
            </Text>
            <PasswordInput
              password={password}
              setPassword={setPassword}
              setErrorPassword={setErrorMessage}
            />
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
            className={`w-full bg-blue-500 h-[45px] ${
              !phone.trim() || !password.trim() ? "opacity-75" : "opacity-100"
            }`}
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
      </VStack>
    </Box>
  );
}

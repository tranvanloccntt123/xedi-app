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
import { ScaledSheet } from "react-native-size-matters";
import Logo from "@/src/components/Logo";
import FormLabel from "@/src/components/FormLabel";
import FormError from "@/src/components/FormError";

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
            <Logo size="xl" className="self-center mb-[26px]" />
            <Heading size="2xl">Đăng nhập Xedi</Heading>
            <Text>Lên xe ngay đi</Text>
          </VStack>
          <FormControl className="w-full mb-1" isInvalid={!!error.phone}>
            <FormLabel>Số điện thoại</FormLabel>
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
            {!!error.phone && <FormError>{error.phone}</FormError>}
          </FormControl>
          <FormControl className="w-full mb-6" isInvalid={!!error.password}>
            <FormLabel>Mật khẩu</FormLabel>
            <PasswordInput
              password={password}
              setPassword={setPassword}
              setErrorPassword={setErrorMessage}
            />
            {!!error.password && <FormError>{error.password}</FormError>}
          </FormControl>
          {errorMessage && <FormError>{errorMessage}</FormError>}
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

const styles = ScaledSheet.create({});

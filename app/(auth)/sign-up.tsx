const APP_STRUCT = "SIGN_UP_SCREEN";

import React from "react";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { FormControl } from "@/src/components/ui/form-control";
import { Input } from "@/src/components/ui/input";
import { InputField } from "@/src/components/ui/input";
import { VStack } from "@/src/components/ui/vstack";
import { Link } from "expo-router";
import { Select } from "@/src/components/ui/select";
import { SelectTrigger } from "@/src/components/ui/select";
import { SelectInput } from "@/src/components/ui/select";
import { SelectPortal } from "@/src/components/ui/select";
import { SelectBackdrop } from "@/src/components/ui/select";
import { SelectContent } from "@/src/components/ui/select";
import { SelectDragIndicator } from "@/src/components/ui/select";
import { SelectItem } from "@/src/components/ui/select";
import {
  formValidatePerField,
  formValidateSuccess,
} from "@/src/utils/validator";
import { authValidator } from "@/src/constants/validator";
import { ScrollView, Text } from "react-native";
import { supabase, xediSupabase } from "@/src/lib/supabase";
import { pattern } from "@/src/constants";
import Logo from "@/src/components/Logo";
import { HStack } from "@/src/components/ui/hstack";
import { wrapTextStyle } from "@/src/theme/AppStyles";
import AppColors from "@/src/constants/colors";
import FormLabel from "@/src/components/FormLabel";
import FormError from "@/src/components/FormError";

export default function SignUp() {
  const [user, setUserState] = useState<Partial<IUser>>({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (key: keyof IUser, value: string | number) => {
    setUserState((prevUser) => ({ ...prevUser, [key]: value }));
    setErrorMessage("");
  };

  const handleSignUp = async () => {
    try {
      const validateForm = formValidatePerField(authValidator, user as never);
      setError(
        Object.fromEntries(
          Object.entries(validateForm).map(([key, value]) => [
            key,
            value.message,
          ])
        )
      );
      if (!formValidateSuccess(validateForm)) {
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        phone: user.phone!,
        password: user.password!,
        email: `${user.phone}${pattern}`,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        xediSupabase.tables.users.signUp({
          id: data.user.id,
          name: user.name || "",
          phone: user.phone || "",
          email: user.email || "",
          role: user.role || "customer",
        });
      }
    } catch (e) {
      console.error(e);
      setErrorMessage(
        "An unexpected error occurred during sign-up. Please try again."
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 16,
      }}
    >
      <VStack space="md" className="w-full max-w-xls">
        <HStack space="md">
          <Logo size="sm" />
          <VStack space="xs" className="mb-6">
            <Text style={wrapTextStyle({ fontWeight: "800" }, "lg")}>
              Đăng ký Xedi
            </Text>
            <Text
              style={wrapTextStyle(
                { fontWeight: "400", color: AppColors.text, opacity: 0.8 },
                "2xs"
              )}
            >
              Tạo tài khoản mới
            </Text>
          </VStack>
        </HStack>
        <FormControl className="w-full mb-1" isInvalid={!!error.name}>
          <FormLabel>Họ và tên</FormLabel>
          <Input variant="outline" size="md" className="h-[45px]">
            <InputField
              placeholder="Nhập họ và tên"
              value={user.name}
              onChangeText={(value) => handleChange("name", value)}
            />
          </Input>
          {!!error.name && <FormError>{error.name}</FormError>}
        </FormControl>
        <FormControl className="w-full mb-1" isInvalid={!!error.phone}>
          <FormLabel>Số điện thoại</FormLabel>
          <Input variant="outline" size="md" className="h-[45px]">
            <InputField
              placeholder="Nhập số điện thoại"
              value={user.phone}
              onChangeText={(value) => handleChange("phone", value)}
              keyboardType="phone-pad"
            />
          </Input>
          {!!error.phone && <FormError>{error.phone}</FormError>}
        </FormControl>
        <FormControl className="w-full mb-1" isInvalid={!!error.email}>
          <FormLabel>Email (không bắt buộc)</FormLabel>
          <Input variant="outline" size="md" className="h-[45px]">
            <InputField
              placeholder="Nhập email"
              value={user.email}
              onChangeText={(value) => handleChange("email", value)}
              keyboardType="email-address"
            />
          </Input>
          {!!error.email && <FormError>{error.email}</FormError>}
        </FormControl>
        <FormControl className="w-full mb-1" isInvalid={!!error.password}>
          <FormLabel>Mật khẩu</FormLabel>
          <Input variant="outline" size="md" className="h-[45px]">
            <InputField
              placeholder="Nhập mật khẩu"
              value={user.password}
              onChangeText={(value) => handleChange("password", value)}
              secureTextEntry
            />
          </Input>
          {!!error.password && <FormError>{error.password}</FormError>}
        </FormControl>
        <FormControl className="w-full mb-6" isInvalid={!!error.role}>
          <FormLabel>Vai trò</FormLabel>
          <Select
            selectedValue={user.role}
            initialLabel="Khách hàng"
            onValueChange={(value) => handleChange("role", value)}
          >
            <SelectTrigger className="h-[45px]">
              <SelectInput placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicator />
                <SelectItem label="Khách hàng" value="customer" />
                <SelectItem label="Tài xế" value="driver" />
              </SelectContent>
            </SelectPortal>
          </Select>
          {!!error.role && <FormError>{error.role}</FormError>}
        </FormControl>
        {errorMessage && <FormError>{errorMessage}</FormError>}
        <Button size="lg" className="w-full bg-blue-500" onPress={handleSignUp}>
          <ButtonText className="text-white">Đăng ký</ButtonText>
        </Button>
        <Text
          style={wrapTextStyle(
            {
              fontWeight: "500",
              color: AppColors.text,
              opacity: 0.8,
              alignSelf: "center",
            },
            "2xs"
          )}
        >
          Đã có tài khoản?{" "}
          <Link href="/sign-in" className="text-blue-500">
            Đăng nhập
          </Link>
        </Text>
      </VStack>
    </ScrollView>
  );
}

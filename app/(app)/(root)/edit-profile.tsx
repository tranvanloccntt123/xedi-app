const APP_STRUCT = "EDIT_PROFILE_SCREEN";

import React, { useState, useMemo } from "react";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/src/store/store";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Heading } from "@/src/components/ui/heading";
import { Input } from "@/src/components/ui/input";
import { InputField } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { FormControl } from "@/src/components/ui/form-control";
import { ScrollView } from "react-native";
import {
  formValidatePerField,
  formValidateSuccess,
} from "@/src/utils/validator";
import { authValidator } from "@/src/constants/validator";
import {
  FormControlError,
  FormControlErrorText,
} from "@/src/components/ui/form-control";
import { deepEqual } from "@/src/utils/deepEqual";
import { Text } from "@/src/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/src/components/Header";
import { updateUserInfo } from "@/src/store/user/userThunks";
import { wrapTextStyle } from "@/src/theme/AppStyles";

export default function EditProfile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const originalUserData = useMemo(
    () => ({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    }),
    [user]
  );

  const isFormChanged = useMemo(() => {
    const currentData = { name, email, phone };
    return !deepEqual(originalUserData, currentData);
  }, [name, email, phone, originalUserData]);

  const handleInputChange = (field: string, value: string) => {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "phone") setPhone(value);
    setErrors({ ...errors, [field]: "" });
  };

  const handleSave = () => {
    if (user) {
      const formData = { name, email, phone };
      const validateForm = formValidatePerField(
        authValidator,
        formData as never
      );
      setErrors(
        Object.fromEntries(
          Object.entries(validateForm).map(([key, value]) => [
            key,
            value.message,
          ])
        )
      );

      if (formValidateSuccess(validateForm)) {
        const updatedUser = {
          ...user,
          name,
          email,
          phone,
        };
        dispatch(updateUserInfo(updatedUser));
        router.back();
      }
    }
  };

  return (
    <Box className="flex-1 bg-xedi-background">
      <SafeAreaView style={{ flex: 1 }}>
        <Box className="px-4">
          <Header title="Chỉnh sửa hồ sơ" />
        </Box>
        <ScrollView>
          <Box className="px-4">
            <VStack space="md">
              <FormControl isInvalid={!!errors.name}>
                <Text
                  className="color-xedi-text"
                  style={wrapTextStyle({ fontWeight: "600" }, "2xs")}
                >
                  Họ và tên
                </Text>
                <Input className="color-xedi-text h-[45px] bg-xedi-card/[.9] border-0">
                  <InputField
                    value={name}
                    className="color-xedi-text"
                    style={wrapTextStyle({ fontWeight: "400" }, "2xs")}
                    onChangeText={(value) => handleInputChange("name", value)}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>{errors.name}</FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl isInvalid={!!errors.email}>
                <Text
                  className="color-xedi-text"
                  style={wrapTextStyle({ fontWeight: "600" }, "2xs")}
                >
                  Email
                </Text>
                <Input className="h-[45px] rounded-lg border-0 bg-xedi-card/[.9]">
                  <InputField
                    value={email}
                    className="color-xedi-text"
                    style={wrapTextStyle({ fontWeight: "400" }, "2xs")}
                    onChangeText={(value) => handleInputChange("email", value)}
                    keyboardType="email-address"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>{errors.email}</FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl isInvalid={!!errors.phone} isDisabled>
                <Text
                  className="color-xedi-text"
                  style={wrapTextStyle({ fontWeight: "600" }, "2xs")}
                >
                  Số điện thoại
                </Text>
                <Input className="h-[45px] bg-xedi-card border-0">
                  <InputField
                    value={phone}
                    onChangeText={(value) => handleInputChange("phone", value)}
                    keyboardType="phone-pad"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>{errors.phone}</FormControlErrorText>
                </FormControlError>
              </FormControl>
              <Button
                size="lg"
                className={`mt-4 h-[45px] bg-xedi-primary`}
                onPress={handleSave}
                action="default"
                isDisabled={!isFormChanged || name === ""}
              >
                <ButtonText
                  className="text-white"
                  style={wrapTextStyle({ fontWeight: "600" }, "2xs")}
                >
                  Lưu thay đổi
                </ButtonText>
              </Button>
            </VStack>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
}

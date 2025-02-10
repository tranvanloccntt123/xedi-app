const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { deleteFixedRoute } from "@/src/store/fixedRoutesSlice";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { Image, ScrollView, StyleSheet } from "react-native";
import FixedRouteItem from "@/src/components/FixedRouteItem";
import type { IFixedRoute } from "@/src/types";
import { xediSupabase } from "@/src/lib/supabase";
import LottieView from "lottie-react-native";
import Lottie from "@/src/lottie";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack } from "@/src/components/ui/hstack";
import { formatMoney } from "@/src/utils/formatMoney";
import { Divider } from "@/src/components/ui/divider";
import { Input, InputField } from "@/src/components/ui/input";
import {
  Textarea as TextArea,
  TextareaInput as TextAreaInput,
} from "@/src/components/ui/textarea";
import type { RootState } from "@/src/store/store";

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
});

export default function FixedRouteDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [fixedRoute, setFixedRoute] = useState<IFixedRoute>();

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(false);

  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const user = useSelector((state: RootState) => state.auth.user);

  React.useEffect(() => {
    const fetch = async () => {
      if (isLoading) return;
      setIsLoading(true);
      const { data, error } = await xediSupabase.tables.fixedRoutes.selectById(
        id
      );
      if (data?.[0] && !error) {
        setFixedRoute(data[0]);
      } else {
        setError(true);
      }
      setIsLoading(false);
    };
    fetch();
  }, [id]); // Added isLoading to dependencies

  if (isLoading) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Box className="w-[200px] h-[200px]">
          <LottieView
            source={Lottie.FIND_LOCATION}
            colorFilters={[]}
            style={{ width: "100%", height: "100%" }}
            autoPlay
            loop
          />
        </Box>
        <Image
          source={require("../../../../assets/images/logo.png")}
          style={styles.logo}
        />
      </Box>
    );
  }

  if (error && !isLoading) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Text>Không tìm thấy tuyến đường</Text>
      </Box>
    );
  }

  const handleDelete = () => {
    dispatch(deleteFixedRoute(fixedRoute.id));
    router.back();
  };

  const handleOrder = async () => {
    if (!user || !fixedRoute) return;

    try {
      const { data, error } = await xediSupabase.tables.fixedRouteOrders.add([
        {
          fixed_route_id: fixedRoute.id,
          user_id: user.id,
          name,
          phone_number: phoneNumber,
          note,
        },
      ]);

      if (error) throw error;

      // Show success message and reset form
      // You might want to use a toast or alert here
      console.log("Order placed successfully");
      setName("");
      setPhoneNumber("");
      setNote("");
    } catch (error) {
      console.error("Error placing order:", error);
      // Show error message
    }
  };

  return (
    <Box className="flex-1 bg-gray-100">
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <Box className="flex-1 p-4 bg-gray-100">
            <VStack space="md">
              <Heading size="xl">Chi tiết hành trình</Heading>
              {!!fixedRoute && (
                <FixedRouteItem
                  className="mx-0"
                  fixedRoute={fixedRoute}
                  disabled
                  isHiddenPrice
                />
              )}
              <Box className="p-4 bg-white rounded-md">
                <VStack space="md">
                  <Heading size="md">Thanh toán</Heading>
                  <HStack space="md">
                    <Text className="flex-1">Cước phí</Text>
                    <Text className="flex-1 text-right text-lg font-[600] text-black">
                      {formatMoney(fixedRoute?.price?.toString() || "")} (VND)
                    </Text>
                  </HStack>
                  <Divider />
                  <HStack>
                    <Heading size="sm" className="flex-1">
                      Trả qua tiền mặt
                    </Heading>
                    <Text className="flex-1 text-right text-lg font-[600] text-black">
                      {formatMoney(fixedRoute?.price?.toString() || "")} (VND)
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Box>
          {user?.role === "customer" ? (
            <VStack space="md" className="bg-white p-4 rounded-sm">
              <Input>
                <InputField
                  placeholder="Tên"
                  value={name}
                  onChangeText={setName}
                />
              </Input>
              <Input>
                <InputField
                  placeholder="Số điện thoại"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </Input>
              <TextArea>
                <TextAreaInput
                  placeholder="Ghi chú"
                  value={note}
                  onChangeText={setNote}
                />
              </TextArea>
              <Button
                className="rounded-md"
                size="xl"
                onPress={() => handleOrder()}
              >
                <ButtonText>Đặt chuyến</ButtonText>
              </Button>
            </VStack>
          ) : (
            <HStack space="md" className="bg-white p-4 rounded-sm">
              <Button
                className="flex-1 rounded-md"
                size="xl"
                variant="outline"
                onPress={() => router.back()}
              >
                <ButtonText className="text-typography-500">
                  Quay lại
                </ButtonText>
              </Button>
              <Button
                className="flex-1 rounded-md"
                size="xl"
                onPress={() => router.push(`/fixed/${fixedRoute.id}/edit`)}
              >
                <ButtonText>Chỉnh sửa</ButtonText>
              </Button>
            </HStack>
          )}
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
}

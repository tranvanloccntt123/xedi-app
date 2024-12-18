import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import { RouteName, RouteParamsList } from "@/src/types/route";
import AppStyles from "@/src/themes/styles";
import { SafeAreaView } from "react-native-safe-area-context";

type RoleSelectionScreenNavigationProp = StackNavigationProp<
  RouteParamsList,
  RouteName.RoleSelection
>;

export default function RoleSelectionScreen() {
  const navigation = useNavigation<RoleSelectionScreenNavigationProp>();

  const handleRoleSelection = (role: "customer" | "driver") => {
    navigation.navigate(RouteName.Register, { role });
  };

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView style={AppStyles.container}>
        <Box className="p-6 flex-1">
          <Text className="text-2xl font-bold mb-6">Bạn là</Text>
          <VStack space="md" className="mt-5 flex-1">
            <Button
              onPress={() => handleRoleSelection("customer")}
              className="bg-primary-50 rounded-md"
              style={AppStyles.btn}
            >
              <Text className="text-white font-semibold text-lg">
                Khách hàng
              </Text>
            </Button>
            <Button
              onPress={() => handleRoleSelection("driver")}
              className="bg-primary-50 rounded-md"
              style={AppStyles.btn}
            >
              <Text className="text-white font-semibold text-lg">Tài xế</Text>
            </Button>
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


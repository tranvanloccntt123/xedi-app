import React, { useState } from "react";
import { View, Modal, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import { RouteName, RouteParamsList } from "@/src/types/route";
import AppStyles from "../themes/styles";

type RoleSelectionScreenNavigationProp = StackNavigationProp<
  RouteParamsList,
  RouteName.RoleSelection
>;

export default function RoleSelectionScreen() {
  const [modalVisible, setModalVisible] = useState(true);
  const navigation = useNavigation<RoleSelectionScreenNavigationProp>();

  const handleRoleSelection = (role: "customer" | "driver") => {
    setModalVisible(false);
    navigation.navigate(RouteName.Register, { role });
  };

  return (
    <View className="flex-1 justify-center items-center bg-black/[.5]">
      <Box className="bg-white p-6 rounded-lg w-4/5" style={{zIndex: 2}}>
        <Text className="text-2xl font-bold mb-6">Bạn là</Text>
        <VStack space="md">
          <Button
            onPress={() => handleRoleSelection("customer")}
            className="bg-blue-500 rounded-md"
          >
            <Text className="text-white font-semibold">Customer</Text>
          </Button>
          <Button
            onPress={() => handleRoleSelection("driver")}
            className="bg-green-500 rounded-md"
          >
            <Text className="text-white font-semibold">Driver</Text>
          </Button>
        </VStack>
      </Box>
      <Pressable style={[styles.bgBtn]} onPress={navigation.goBack}></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bgBtn: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});

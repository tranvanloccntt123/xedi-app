import React from "react";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Text } from "@/src/components/ui/text";
import { Button } from "@/src/components/ui/button";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import { Box } from "@/src/components/ui/box";
import { Divider } from "@/src/components/ui/divider";
import { Avatar } from "@/src/components/ui/avatar";
import { Icon } from "@/src/components/ui/icon";
import { RouteName, RouteParamsList } from "@/src/types/route";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/src/features/auth/authSlice";
import { RootState } from "@/src/store";

type SettingScreenNavigationProp = StackNavigationProp<
  RouteParamsList,
  RouteName.Settings
>;

const SettingItem = ({ iconName, title, onPress }) => (
  <Button
    onPress={onPress}
    variant="outline"
    className="justify-start py-4 bg-transparent border-transparent"
  >
    <HStack space="md" className="item-center">
      {/* <Icon as={iconName} size="md" color="gray" /> */}
      <Text className="text-base text-gray-800">{title}</Text>
    </HStack>
  </Button>
);

export default function SettingScreen() {
  const navigation = useNavigation<SettingScreenNavigationProp>();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate(RouteName.Login);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <Box className="bg-green-500 p-6">
        <HStack space="md" alignItems="center">
          <Avatar
            source={{ uri: "https://via.placeholder.com/100" }}
            size="lg"
          />
          <VStack>
            <Text className="text-xl font-bold text-white">{user?.name}</Text>
            <Text className="text-white">{user?.phone}</Text>
          </VStack>
        </HStack>
      </Box>

      <Box className="bg-white mt-4">
        <SettingItem
          iconName="PersonIcon"
          title="Thông tin cá nhân"
          onPress={() =>
            navigation.navigate(RouteName.UserProfile, { userId: user?._id })
          }
        />
        <Divider />
        {user?.role === "driver" && (
          <>
            <SettingItem
              iconName="CarIcon"
              title="Quản lý phương tiện"
              onPress={() =>
                navigation.navigate(RouteName.VehicleRegistration, {
                  driverId: user?._id,
                })
              }
            />
            <Divider />
          </>
        )}
        <SettingItem
          iconName="CreditCardIcon"
          title="Phương thức thanh toán"
          onPress={() => {
            /* TODO: Implement payment methods screen */
          }}
        />
        <Divider />
        <SettingItem
          iconName="BellIcon"
          title="Thông báo"
          onPress={() => {
            /* TODO: Implement notifications settings screen */
          }}
        />
      </Box>

      <Box className="bg-white mt-4">
        <SettingItem
          iconName="HelpCircleIcon"
          title="Trợ giúp"
          onPress={() => {
            /* TODO: Implement help screen */
          }}
        />
        <Divider />
        <SettingItem
          iconName="LogOutIcon"
          title="Đăng xuất"
          onPress={handleLogout}
        />
      </Box>
    </ScrollView>
  );
}

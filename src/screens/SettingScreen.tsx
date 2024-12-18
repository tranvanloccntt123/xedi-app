import React from "react";
import { ScrollView, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Text } from "@/src/components/ui/text";
import { Button } from "@/src/components/ui/button";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import { Box } from "@/src/components/ui/box";
import { Divider } from "@/src/components/ui/divider";
import { Avatar, AvatarFallbackText } from "@/src/components/ui/avatar";
import { RouteName, RouteParamsList } from "@/src/types/route";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/src/features/auth/authSlice";
import { RootState } from "@/src/store";
import AppStyles from "@/src/themes/styles"; // Added import

type SettingScreenNavigationProp = StackNavigationProp<
  RouteParamsList,
  RouteName.Settings
>;

const SettingItem = ({ title, onPress }: { title: string; onPress: any }) => (
  <Button
    onPress={onPress}
    variant="outline"
    className="justify-start bg-transparent border-transparent h-[40px]"
  >
    <HStack space="md" className="items-center">
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
    <Box className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView className="flex-1 bg-gray-100">
          <Box className="bg-green-500 p-6">
            <HStack space="md" className="items-center">
              <Avatar size="lg">
                <AvatarFallbackText>{user?.name}</AvatarFallbackText>
              </Avatar>
              <VStack>
                <Text className="text-xl font-bold text-white">
                  {user?.name}
                </Text>
                <Text className="text-white">{user?.phone}</Text>
              </VStack>
            </HStack>
          </Box>

          <Box className="bg-white mt-4">
            <SettingItem
              title="Thông tin cá nhân"
              onPress={() =>
                navigation.navigate(RouteName.UserProfile, {
                  userId: user?._id ?? "",
                })
              }
            />
            <Divider />
            {user?.role === "driver" && (
              <>
                <SettingItem
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
              title="Phương thức thanh toán"
              onPress={() => {
                /* TODO: Implement payment methods screen */
              }}
            />
            <Divider />
            <SettingItem
              title="Thông báo"
              onPress={() => {
                /* TODO: Implement notifications settings screen */
              }}
            />
          </Box>

          <Box className="bg-white mt-4">
            <SettingItem
              title="Trợ giúp"
              onPress={() => {
                /* TODO: Implement help screen */
              }}
            />
            <Divider />
            <SettingItem title="Đăng xuất" onPress={handleLogout} />
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
}

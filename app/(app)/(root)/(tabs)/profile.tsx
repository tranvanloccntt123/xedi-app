import { logout, clearAuthData } from "@/src/store/authSlice";
import { clearFixedRoutes } from "@/src/store/fixedRoutesSlice";
import { clearTripRequests } from "@/src/store/tripRequestsSlice";
import { supabase } from "@/src/lib/supabase";
import { clearUser } from "@/src/store/userSlice";

const APP_STRUCT = "PROFILE_SCREEN";

import React from "react";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { Heading } from "@/src/components/ui/heading";
import { Divider } from "@/src/components/ui/divider";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/src/store/store";
import { useRouter } from "expo-router";
import { Pressable, ScrollView } from "react-native";
import ChevronRightIcon from "@/src/components/icons/ChevronRightIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, AvatarFallbackText } from "@/src/components/ui/avatar";
import CoinsIcon from "@/src/components/icons/CoinsIcon";

const ProfileSection = ({ title, subtitle, onPress }) => (
  <Pressable onPress={onPress}>
    <HStack space="md" className="items-center">
      <VStack className="flex-1">
        <Text className="font-semibold">{title}</Text>
        <Text className="text-gray-600">{subtitle}</Text>
      </VStack>
      <ChevronRightIcon size={24} color="gray" />
    </HStack>
  </Pressable>
);

export default function Profile() {
  const router = useRouter();
  const { user, coins } = useSelector((state: RootState) => state.auth);
  const { top } = useSafeAreaInsets();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(logout());
      dispatch(clearFixedRoutes());
      dispatch(clearTripRequests());
      dispatch(clearAuthData());
      dispatch(clearUser());
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <ScrollView>
      <Box className="bg-primary-500 p-4">
        <HStack
          space="md"
          className="items-center justify-between"
          style={{ paddingTop: top }}
        >
          <HStack space="md">
            <Avatar>
              <AvatarFallbackText>{user?.name}</AvatarFallbackText>
            </Avatar>
            <VStack>
              <Heading size="lg" className="text-white">
                {user?.name}
              </Heading>
              <Text className="text-white">{user?.phone}</Text>
            </VStack>
          </HStack>
          <VStack>
            <Button>
              <HStack space="sm">
                <CoinsIcon size={24} />
                <Text className="text-white">{coins?.coins || 0}</Text>
              </HStack>
            </Button>
          </VStack>
        </HStack>
      </Box>

      <VStack space="md" className="p-4">
        <Heading size="sm">Tài khoản</Heading>
        <ProfileSection
          title="Thông tin cá nhân"
          subtitle="Quản lý thông tin cá nhân của bạn"
          onPress={() => router.push("/edit-profile")}
        />
        <ProfileSection
          title="Địa điểm đã lưu"
          subtitle="Quản lý các địa điểm yêu thích của bạn"
          onPress={() => router.push("/add-location")}
        />

        <Divider className="my-2" />

        <Heading size="sm">Tùy chọn</Heading>
        <ProfileSection
          title="Thông báo"
          subtitle="Quản lý cài đặt thông báo của bạn"
          onPress={() => {
            /* Navigate to notifications screen */
          }}
        />
        <ProfileSection
          title="Ngôn ngữ"
          subtitle="Thay đổi ngôn ngữ ứng dụng"
          onPress={() => {
            /* Navigate to language selection screen */
          }}
        />

        <Divider className="my-2" />

        <Heading size="sm">Hỗ trợ</Heading>
        <ProfileSection
          title="Trung tâm trợ giúp"
          subtitle="Nhận trợ giúp và liên hệ hỗ trợ"
          onPress={() => {
            /* Navigate to help center screen */
          }}
        />
        <ProfileSection
          title="Giới thiệu"
          subtitle="Tìm hiểu thêm về Xedi"
          onPress={() => {
            /* Navigate to about screen */
          }}
        />

        <Button
          size="lg"
          variant="outline"
          className="mt-4"
          onPress={handleLogout}
        >
          <ButtonText>Đăng xuất</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
}

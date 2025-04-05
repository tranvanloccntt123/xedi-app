import React from "react";
import { logout, clearAuthData } from "@/src/store/auth/authSlice";
import { clearFixedRoutes } from "@/src/store/fixedRoute/fixedRoutesSlice";
import { supabase } from "@/src/lib/supabase";
import { clearUser } from "@/src/store/user/userSlice";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import { Divider } from "@/src/components/ui/divider";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/src/store/store";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";
import ChevronRightIcon from "@/src/components/icons/ChevronRightIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import AppColors from "@/src/constants/colors";
import { wrapTextStyle } from "@/src/theme/AppStyles";
import { ScaledSheet } from "react-native-size-matters";

const ProfileSection = ({ title, subtitle, onPress }) => (
  <Pressable onPress={onPress}>
    <HStack space="md" className="items-center">
      <VStack className="flex-1">
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subtitle}</Text>
      </VStack>
      <ChevronRightIcon size={24} color="gray" />
    </HStack>
  </Pressable>
);

export default function Profile() {
  const router = useRouter();
  const { coins } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(logout());
      dispatch(clearFixedRoutes());
      // dispatch(clearTripRequests());
      dispatch(clearAuthData());
      dispatch(clearUser());
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Box className="flex-1 bg-xedi-background">
      <SafeAreaView>
        <ScrollView
          bounces={false}
          style={{ backgroundColor: AppColors.background }}
        >
          <VStack space="md" className="p-4 flex-1">
            <Text style={wrapTextStyle({ fontWeight: "700" }, "2xs")}>
              Tài khoản
            </Text>
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
            <ProfileSection
              title={`${coins?.coins || 0} Điểm`}
              subtitle="Rút tiền trong vòng 24 giờ."
              onPress={() => router.push("/edit-profile")}
            />
            <Divider className="my-2" />

            <Text style={wrapTextStyle({ fontWeight: "700" }, "2xs")}>
              Tùy chọn
            </Text>
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

            <Text style={wrapTextStyle({ fontWeight: "700" }, "2xs")}>
              Hỗ trợ
            </Text>
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
              className="mt-[54px] self-center rounded-full bg-xedi-white shadow-xs"
              onPress={handleLogout}
            >
              <ButtonText
                className="color-xedi-text"
                style={wrapTextStyle({ fontWeight: "600" }, "2xs")}
              >
                Đăng xuất
              </ButtonText>
            </Button>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
}

const styles = ScaledSheet.create({
  title: {
    ...wrapTextStyle({ fontWeight: "600" }, "2xs"),
    color: AppColors.text,
  },
  subTitle: {
    ...wrapTextStyle({ fontWeight: "400" }, "xs"),
    color: AppColors.text,
    opacity: 0.8,
  },
});

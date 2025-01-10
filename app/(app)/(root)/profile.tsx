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
import { logout } from "@/src/store/authSlice";
import { RootState } from "@/src/store/store";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView } from "react-native";

const ProfileSection = ({ title, subtitle, onPress }) => (
  <Pressable onPress={onPress}>
    <HStack space="md" className="items-center">
      <VStack className="flex-1">
        <Text className="font-semibold">{title}</Text>
        <Text className="text-gray-600">{subtitle}</Text>
      </VStack>
      <Ionicons name="chevron-forward" size={24} color="gray" />
    </HStack>
  </Pressable>
);

export default function Profile() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/sign-in");
  };

  return (
    <ScrollView>
      <Box className="bg-blue-500 p-4">
        <HStack space="md" className="items-center">
          <VStack>
            <Heading size="lg" className="text-white">
              {user?.name}
            </Heading>
            <Text className="text-white">{user?.phone}</Text>
          </VStack>
        </HStack>
      </Box>

      <VStack space="md" className="p-4">
        <Heading size="sm">Account</Heading>
        <ProfileSection
          title="Personal Information"
          subtitle="Manage your personal details"
          onPress={() => {
            /* Navigate to personal info screen */
          }}
        />
        <ProfileSection
          title="Payment Methods"
          subtitle="Add or remove payment options"
          onPress={() => {
            /* Navigate to payment methods screen */
          }}
        />
        <ProfileSection
          title="Saved Places"
          subtitle="Manage your favorite locations"
          onPress={() => {
            /* Navigate to saved places screen */
          }}
        />

        <Divider className="my-2" />

        <Heading size="sm">Preferences</Heading>
        <ProfileSection
          title="Notifications"
          subtitle="Manage your notification settings"
          onPress={() => {
            /* Navigate to notifications screen */
          }}
        />
        <ProfileSection
          title="Language"
          subtitle="Change app language"
          onPress={() => {
            /* Navigate to language selection screen */
          }}
        />

        <Divider className="my-2" />

        <Heading size="sm">Support</Heading>
        <ProfileSection
          title="Help Center"
          subtitle="Get help and contact support"
          onPress={() => {
            /* Navigate to help center screen */
          }}
        />
        <ProfileSection
          title="About"
          subtitle="Learn more about Xedi"
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
          <ButtonText>Logout</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
}


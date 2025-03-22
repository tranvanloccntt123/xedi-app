import React from "react";
import { Box } from "@/src/components/ui/box";
import AppStyles from "@/src/theme/AppStyles";
import { Heading } from "@/src/components/ui/heading";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/src/components/ui/button";
import CloseIcon from "@/src/components/icons/CloseIcon";
import { IconSize } from "@/src/theme/Size";
import { Divider } from "@/src/components/ui/divider";
import { router } from "expo-router";

export default function Comment() {
  return (
    <Box className="flex-1">
      <SafeAreaView style={AppStyles.container}>
        <Box className="items-center justify-center" style={AppStyles.header}>
          <Heading>Bình luận</Heading>
          <Box className="absolute right-[16px]">
            <Button
              variant="link"
              action="default"
              onPress={() => router.back()}
            >
              <CloseIcon size={IconSize.md} color="#000" />
            </Button>
          </Box>
        </Box>
        <Box className="flex-1"></Box>

        <Divider />
      </SafeAreaView>
    </Box>
  );
}

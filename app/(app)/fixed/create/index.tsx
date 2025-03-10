import React from "react";
import { Box } from "@/src/components/ui/box";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/src/components/Header";

export default function CreateFixedRoute() {
  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        <Box className="px-4">
          <Header
            title="Bắt đầu hành trình mới"
            subTitle="Chúc bạn có một hành trình an toàn!"
          />
        </Box>
      </SafeAreaView>
    </Box>
  );
}

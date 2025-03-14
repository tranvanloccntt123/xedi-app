import Header from "@/src/components/Header";
import { Box } from "@/src/components/ui/box";
import { router } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import NetworkLogger from "react-native-network-logger";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NetworkDebug() {
  React.useEffect(() => {
    Platform.OS === "web" && router.back();
  }, []);
  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        <Box className="px-4">
          <Header title={"Welcome to the Network logger"} />
        </Box>
        <NetworkLogger theme={"light"} />
      </SafeAreaView>
    </Box>
  );
}

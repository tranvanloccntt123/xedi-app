const APP_STRUCT = "HOME_SCREEN"

import React from "react"
import { Box } from "@/src/components/ui/box"
import { Heading } from "@/src/components/ui/heading"
import { VStack } from "@/src/components/ui/vstack"
import { useSelector } from "react-redux"
import type { RootState } from "@/src/store/store"
import { Platform, ScrollView } from "react-native"
import { Text } from "@/src/components/ui/text"

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <Box className="flex-1 bg-gray-100">
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={Platform.OS === "web"}
        contentContainerStyle={{ width: "100%" }}
      >
        <VStack space="md" className="w-full p-4">
          <Heading size="lg" className="mb-4">
            Xin Chào, {user?.phone}
          </Heading>
          <Text className="text-gray-600">Chào mừng bạn đến với Xedi. Hãy bắt đầu chuyến đi của bạn ngay hôm nay!</Text>
          {/* Add more content for the home screen here */}
        </VStack>
      </ScrollView>
    </Box>
  )
}


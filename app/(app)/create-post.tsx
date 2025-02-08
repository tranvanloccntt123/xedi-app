import React, { useRef, useState } from "react";
import { Platform, Pressable, ScrollView } from "react-native";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Heading } from "@/src/components/ui/heading";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MentionInput } from "@/src/components/ControlledMentions";
import { HStack } from "@/src/components/ui/hstack";
import ChevronLeftIcon from "@/src/components/icons/ChevronLeftIcon";
import FixedRouteIcon from "@/src/components/icons/FixedRouteIcon";
import AddFixedRouteModal from "@/src/components/AddFixedRouteModal";
import { xediSupabase } from "@/src/lib/supabase";

export default function CreatePost() {
  const [fixedRouteModalVisible, setFixedRouteModalVisible] = useState(false);
  //TODO
  const [content, setContent] = useState<string>("");
  const router = useRouter();
  const ref = useRef(null);

  const handleCreatePost = async () => {
    const {data} = await xediSupabase.tables.feed.addWithUserId([{content}]);
  };

  return (
    <Box className="flex-1 bg-gray-100">
      <SafeAreaView style={{ flex: 1 }}>
        <Box className="p-4 flex-1">
          <HStack space="sm" className="items-center mb-6">
            <Button variant="link" onPress={router.back}>
              <ChevronLeftIcon size={24} color="#000000" />
            </Button>
            <Heading size="xl" className="flex-1">
              Tạo bài đăng
            </Heading>
            <Button
              className="rounded-full"
              size="lg"
              onPress={handleCreatePost}
            >
              <ButtonText>Tạo</ButtonText>
            </Button>
          </HStack>
          <VStack space="md" className="bg-white flex-1 rounded-2xl p-4">
            <Pressable style={{ flex: 1 }} onPress={() => ref.current?.focus()}>
              <ScrollView showsVerticalScrollIndicator={Platform.OS === "web"}>
                <MentionInput
                  inputRef={ref}
                  value={content}
                  onChange={setContent}
                />
              </ScrollView>
            </Pressable>
          </VStack>
          <HStack space="lg" className="mt-4">
            <Button
              variant="link"
              onPress={() => setFixedRouteModalVisible(true)}
            >
              <HStack space="sm" className="items-center">
                <Box className="w-[30px] h-[30px] bg-typography-100 items-center justify-center rounded-full">
                  <FixedRouteIcon size={18} color="#000000" />
                </Box>
                <ButtonText className="text-black">
                  Tạo tuyến cố định
                </ButtonText>
              </HStack>
            </Button>
          </HStack>
        </Box>
      </SafeAreaView>
      <AddFixedRouteModal
        visible={fixedRouteModalVisible}
        onClose={() => setFixedRouteModalVisible(false)}
      />
    </Box>
  );
}

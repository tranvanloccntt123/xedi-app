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
import { IFixedRoute } from "@/src/types";
import FixedRouteItem from "@/src/components/FixedRouteItem";

const ROUNDED = 15;

export default function CreatePost() {
  const [fixedRouteModalVisible, setFixedRouteModalVisible] = useState(false);
  //TODO
  const [content, setContent] = useState<string>("");
  const [fixedRoutes, setFixedRoutes] = useState<IFixedRoute[]>([]);
  const router = useRouter();
  const ref = useRef(null);

  const handleCreatePost = async () => {
    const { data } = await xediSupabase.tables.feed.addWithUserId([
      { content },
    ]);
    if (data?.[0]) {
      fixedRoutes.forEach(async (fixedRoute) => {
        xediSupabase.tables.fixedRoutes.updateById(fixedRoute.id, {feed_id: data[0].id})
      });
      router.back();
      return;
    }
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
          <VStack space="md" className="flex-1">
            <VStack
              space="md"
              className="bg-white flex-1"
              style={{ borderRadius: ROUNDED }}
            >
              <Pressable
                style={{ flex: 1 }}
                onPress={() => ref.current?.focus()}
              >
                <MentionInput
                  inputRef={ref}
                  value={content}
                  onChange={setContent}
                  containerStyle={{
                    flex: 1,
                  }}
                  style={{
                    height: "100%",
                    borderWidth: 0,
                    borderColor: "white",
                    borderRadius: ROUNDED,
                    padding: ROUNDED,
                  }}
                  textAlignVertical="top"
                />
              </Pressable>
            </VStack>
            {!!fixedRoutes.length && (
              <Box>
                <ScrollView horizontal>
                  <HStack space="md">
                    {fixedRoutes.map((fixedRoute) => (
                      <Box key={fixedRoute.id}>
                        <FixedRouteItem fixedRoute={fixedRoute} disabled />
                      </Box>
                    ))}
                  </HStack>
                </ScrollView>
              </Box>
            )}
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
        onFixedRouteCreated={(fixedRoute) =>
          setFixedRoutes((old) => [...old, fixedRoute])
        }
      />
    </Box>
  );
}


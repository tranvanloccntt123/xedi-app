import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView } from "react-native";
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
import FixedRouteItem from "@/src/components/FixedRouteItem";
import OnlyDriver from "@/src/components/OnlyDriver";
import OnlyCustomer from "@/src/components/OnlyCustomer";
import HiIcon from "@/src/components/icons/HiIcon";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import {
  setContent,
  setFixedRoutes,
  resetPost,
  setDepartureTime,
} from "@/src/store/postSlice";
import { Text } from "@/src/components/ui/text";
import DateTime from "@/src/components/DateTime";
const ROUNDED = 15;

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export default function CreatePost() {
  const dispatch = useDispatch();
  const [fixedRouteModalVisible, setFixedRouteModalVisible] = useState(false);
  //TODO
  const { content, fixedRoutes, startLocation, endLocation, departureTime } =
    useSelector((state: RootState) => state.post);

  useEffect(() => {
    // Reset the post slice when the component mounts
    dispatch(resetPost());
  }, [dispatch]);

  const router = useRouter();
  const ref = useRef(null);

  const handleCreatePost = async () => {
    const { data } = await xediSupabase.tables.feed.addWithUserId([
      { content },
    ]);
    if (data?.[0]) {
      if (fixedRoutes) {
        fixedRoutes.forEach(async (fixedRoute) => {
          xediSupabase.tables.fixedRoutes.updateById(fixedRoute.id, {
            feed_id: data[0].id,
          });
        });
      }
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
              className={`rounded-full ${
                content ? "bg-primary-400" : "bg-primary-400/[.5]"
              }`}
              size="lg"
              onPress={handleCreatePost}
              disabled={!content}
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
                  onChange={(text) => {
                    dispatch(setContent(text));
                  }}
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
            <OnlyDriver>
              {!!fixedRoutes?.length && (
                <Box>
                  <ScrollView horizontal>
                    <HStack space="md">
                      {fixedRoutes.map((fixedRoute) => (
                        <Box key={fixedRoute.id}>
                          <FixedRouteItem
                            fixedRoute={fixedRoute}
                            className="w-[280px]"
                            disabled
                          />
                        </Box>
                      ))}
                    </HStack>
                  </ScrollView>
                </Box>
              )}
            </OnlyDriver>
          </VStack>
          <VStack space="lg" className="mt-4">
            <OnlyDriver>
              <Button
                variant="link"
                className="justify-start"
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
            </OnlyDriver>
            <OnlyCustomer>
              <Box className="bg-white p-2 rounded-full">
                <DateTime
                  date={departureTime}
                  onChangeDate={(date) => {
                    dispatch(setDepartureTime(date));
                  }}
                  placeholder="Khởi hành lúc"
                  variant={"link"}
                />
              </Box>
              <Button
                variant="link"
                className="justify-start"
                onPress={() =>
                  router.push("/create-post-location?type=startLocation")
                }
              >
                <HStack space="sm" className="items-center">
                  <Box className="w-[30px] h-[30px] bg-typography-100 items-center justify-center rounded-full">
                    <HiIcon size={18} color="#000000" />
                  </Box>
                  <ButtonText className="text-black">
                    {startLocation
                      ? truncateText(startLocation.display_name, 30)
                      : "Thêm vị trí bắt đầu"}
                  </ButtonText>
                </HStack>
              </Button>
              <Button
                variant="link"
                className="justify-start"
                onPress={() =>
                  router.push("/create-post-location?type=endLocation")
                }
              >
                <HStack space="sm" className="items-center">
                  <Box className="w-[30px] h-[30px] bg-typography-100 items-center justify-center rounded-full">
                    <FixedRouteIcon size={18} color="#000000" />
                  </Box>
                  <ButtonText className="text-black">
                    {endLocation
                      ? truncateText(endLocation.display_name, 30)
                      : "Thêm điểm đến"}
                  </ButtonText>
                </HStack>
              </Button>
            </OnlyCustomer>
          </VStack>
        </Box>
      </SafeAreaView>
      <OnlyDriver>
        <AddFixedRouteModal
          visible={fixedRouteModalVisible}
          onClose={() => setFixedRouteModalVisible(false)}
          onFixedRouteCreated={(fixedRoute) => setFixedRoutes(fixedRoute)}
        />
      </OnlyDriver>
    </Box>
  );
}

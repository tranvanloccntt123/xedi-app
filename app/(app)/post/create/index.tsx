import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Heading } from "@/src/components/ui/heading";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { router, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MentionInput } from "@/src/components/ControlledMentions";
import { HStack } from "@/src/components/ui/hstack";
import ChevronLeftIcon from "@/src/components/icons/ChevronLeftIcon";
import FixedRouteIcon from "@/src/components/icons/FixedRouteIcon";
import AddFixedRouteModal from "@/src/components/FixedRoute/AddFixedRouteModal";
import FixedRouteItem from "@/src/components/FixedRoute/FixedRouteItem";
import OnlyDriver from "@/src/components/View/OnlyDriver";
import OnlyCustomer from "@/src/components/View/OnlyCustomer";
import HiIcon from "@/src/components/icons/HiIcon";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import {
  setContent,
  setFixedRoutes,
  resetPost,
  setTripRequestDepartureTime,
} from "@/src/store/post/postFormSlice";
import DateTime from "@/src/components/DateTime";
import ErrorModal from "@/src/components/ErrorModal";
import CreatePostButton from "@/src/components/Feed/CreatePost";
import ImageIcon from "@/src/components/icons/ImageIcon";
const ROUNDED = 15;

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

const CustomerExpand: React.FC<object> = () => {
  const { startLocation, endLocation, departureTime } = useSelector(
    (state: RootState) => state.postForm.tripRequest
  );
  const dispatch = useDispatch();
  return (
    <OnlyCustomer>
      <Box className="bg-white p-2 rounded-full">
        <DateTime
          date={departureTime}
          onChangeDate={(date) => {
            dispatch(setTripRequestDepartureTime(date));
          }}
          placeholder="Khởi hành lúc"
          variant={"link"}
        />
      </Box>
      <Button
        variant="link"
        className="justify-start"
        onPress={() =>
          router.push("/post/create/post-location?type=startLocation")
        }
      >
        <HStack space="sm" className="items-center">
          <Box className="w-[30px] h-[30px] bg-typography-100 items-center justify-center rounded-full">
            <HiIcon size={18} color="#000000" />
          </Box>
          <ButtonText className="text-black">
            {startLocation
              ? truncateText(startLocation.display_name, 30)
              : "Thêm điểm đón"}
          </ButtonText>
        </HStack>
      </Button>
      <Button
        variant="link"
        className="justify-start"
        onPress={() =>
          router.push("/post/create/post-location?type=endLocation")
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
  );
};

export default function CreatePost() {
  const dispatch = useDispatch();
  const [fixedRouteModalVisible, setFixedRouteModalVisible] = useState(false);
  //TODO
  const { content } = useSelector((state: RootState) => state.postForm);

  const [isError, setIsError] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Reset the post slice when the component mounts
    return () => {
      dispatch(resetPost({}));
    };
  }, []);

  const router = useRouter();
  const ref = useRef(null);

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
            <CreatePostButton
              onError={(message) => {
                setIsError(true);
                setErrorMessage(message);
              }}
              onCreatePostSuccess={() => router.back()}
            />
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
            {/* <OnlyDriver>
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
            </OnlyDriver> */}
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
            <CustomerExpand />
            <Button
              variant="link"
              className="justify-start"
              onPress={() => router.push("/post/create/image-selection")}
            >
              <HStack space="sm" className="items-center">
                <Box className="w-[30px] h-[30px] bg-typography-100 items-center justify-center rounded-full">
                  <ImageIcon size={18} color="#000000" />
                </Box>
                <ButtonText className="text-black">Thêm ảnh</ButtonText>
              </HStack>
            </Button>
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
      <ErrorModal
        showModal={isError}
        setShowModal={setIsError}
        title="Tạo hành trình"
        message={errorMessage}
      />
    </Box>
  );
}

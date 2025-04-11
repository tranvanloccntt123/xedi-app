import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, ScrollView, TouchableOpacity } from "react-native";
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
import OnlyDriver from "@/src/components/View/OnlyDriver";
import OnlyCustomer from "@/src/components/View/OnlyCustomer";
import HiIcon from "@/src/components/icons/HiIcon";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import {
  setContent,
  resetPost,
  setTripRequestDepartureTime,
  removeImage,
} from "@/src/store/postForm/postFormSlice";
import DateTime from "@/src/components/DateTime";
import ErrorModal from "@/src/components/ErrorModal";
import CreatePostButton from "@/src/components/Feed/CreatePost";
import ImageIcon from "@/src/components/icons/ImageIcon";
import FixedRouteItem from "@/src/components/FixedRoute/FixedRouteItem";
import { wrapTextStyle } from "@/src/theme/AppStyles";
import { scale, ScaledSheet } from "react-native-size-matters";
import TrashIcon from "@/src/components/icons/TrashIcon";
import AppColors from "@/src/constants/colors";
import Animated from "react-native-reanimated";
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
          <ButtonText
            className="color-xedi-text"
            style={wrapTextStyle({ fontWeight: "500" }, "2xs")}
          >
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
          <ButtonText
            className="color-xedi-text"
            style={wrapTextStyle({ fontWeight: "500" }, "2xs")}
          >
            {endLocation
              ? truncateText(endLocation.display_name, 30)
              : "Thêm điểm đến"}
          </ButtonText>
        </HStack>
      </Button>
    </OnlyCustomer>
  );
};

const ImageThumbnail: React.FC<{ uri: string; index: number }> = ({
  uri,
  index,
}) => {
  const dispatch = useDispatch();
  const handlerDelete = () => {
    dispatch(removeImage(index));
  };

  return (
    <Animated.View>
      <TouchableOpacity onPress={handlerDelete} style={styles.removeBtn}>
        <TrashIcon size={scale(14)} color={AppColors.error} />
      </TouchableOpacity>
      <Image source={{ uri }} style={styles.thumbnail} />
    </Animated.View>
  );
};

export default function CreatePost() {
  const dispatch = useDispatch();
  //TODO
  const { content, fixedRoutes, images } = useSelector(
    (state: RootState) => state.postForm
  );

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
    <Box className="flex-1 bg-xedi-background">
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
            <Box className="flex-1 bg-xedi-primary/[.2] rounded-2xl">
              <Pressable
                style={{ flex: 1 }}
                onPress={() => ref.current?.focus()}
              >
                <ScrollView style={{ flex: 1 }}>
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
                      borderRadius: ROUNDED,
                      padding: ROUNDED,
                    }}
                    textAlignVertical="top"
                  />
                </ScrollView>
              </Pressable>
            </Box>
            {!!images?.length && (
              <Box>
                <ScrollView
                  bounces={false}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  <HStack space="xs">
                    {images.map((image, index) => (
                      <ImageThumbnail
                        key={index.toString()}
                        uri={`data:image/jpeg;base64,${image}`}
                        index={index}
                      />
                    ))}
                  </HStack>
                </ScrollView>
              </Box>
            )}
            <OnlyDriver>
              {!!fixedRoutes.startLocation && !!fixedRoutes.endLocation && (
                <Box className="w-full">
                  <FixedRouteItem
                    fixedRoute={
                      {
                        ...fixedRoutes,
                        id: 0,
                        user_id: "",
                        created_at: new Date(),
                        availableSeats: 0,
                        status: 0,
                        departureTime: (
                          fixedRoutes.departureTime || new Date()
                        ).toDateString(),
                      } as IFixedRoute
                    }
                    disabled
                  />
                </Box>
              )}
            </OnlyDriver>
          </VStack>
          <VStack space="lg" className="mt-4">
            <OnlyDriver>
              <Button
                variant="link"
                className="justify-start"
                onPress={() => router.navigate("fixed/create")}
              >
                <HStack space="sm" className="items-center">
                  <Box className="w-[30px] h-[30px] bg-typography-100 items-center justify-center rounded-full">
                    <FixedRouteIcon size={18} color="#000000" />
                  </Box>
                  <ButtonText
                    className="color-xedi-text"
                    style={wrapTextStyle({ fontWeight: "500" }, "2xs")}
                  >
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
                <ButtonText
                  className="color-xedi-text"
                  style={wrapTextStyle({ fontWeight: "500" }, "2xs")}
                >
                  Thêm ảnh
                </ButtonText>
              </HStack>
            </Button>
          </VStack>
        </Box>
      </SafeAreaView>
      <ErrorModal
        showModal={isError}
        setShowModal={setIsError}
        title="Tạo hành trình"
        message={errorMessage}
      />
    </Box>
  );
}

const styles = ScaledSheet.create({
  thumbnail: {
    width: "100@s",
    height: "100@s",
    resizeMode: "cover",
  },
  removeBtn: {
    position: "absolute",
    right: "2@s",
    top: "2@s",
    width: "30@s",
    height: "30@s",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    backgroundColor: AppColors.card,
    borderRadius: "30@s",
    elevation: 2,
    shadowColor: AppColors.text,
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: "2@s",
  },
});

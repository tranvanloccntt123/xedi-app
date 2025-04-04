import React from "react";
import { Box } from "./ui/box";
import { VStack } from "./ui/vstack";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { wrapTextStyle } from "../theme/AppStyles";
import { Button, ButtonText } from "./ui/button";
import AddIconInLine from "./icons/AddIconInline";
import OnlyCustomer from "./View/OnlyCustomer";
import { Pressable } from "react-native";
import { router } from "expo-router";
import LocationIcon from "./icons/LocationIcon";
import AddIcon from "./icons/AddIcon";
import AppColors from "../constants/colors";
import { resetPost } from "../store/postForm/postFormSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";

const HomeHeader = React.memo(() => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  return (
    <VStack space="md">
      <HStack space="md" className="p-4">
        <VStack className="flex-1" space="md">
          <Text
            style={wrapTextStyle(
              { fontWeight: "700", color: AppColors.text },
              "md"
            )}
          >
            Xin Chào, {user?.name || user?.phone}
          </Text>
          <Text
            className="mb-4"
            style={wrapTextStyle(
              { fontWeight: "500", color: AppColors.text },
              "2xs"
            )}
          >
            Đây là bảng tin mới nhất của bạn. Kéo xuống để cập nhật.
          </Text>
        </VStack>
        <Button
          onPress={() => {
            dispatch(resetPost({}));
            router.push("/post/create");
          }}
          variant="link"
          className="w-[40px] h-[40px] bg-xedi-primary rounded-full"
        >
          <AddIconInLine size={24} color={AppColors.white} />
        </Button>
      </HStack>
      <OnlyCustomer>
        <VStack
          space="sm"
          className="p-2 border-[1px] border-gray-200 bg-white mb-4 mx-2 rounded-xl"
        >
          <Pressable
            onPress={() => router.navigate("/trip/create?type=end-location")}
          >
            <HStack
              space="md"
              className="p-4 rounded-md items-center bg-gray-100"
            >
              <LocationIcon size={24} color="#f56505" />
              <Text className="text-black">Bạn muốn đến đâu</Text>
            </HStack>
          </Pressable>
          <HStack>
            <Button variant="link">
              <AddIcon size={24} color="rgb(52, 170, 246)" />
              <ButtonText className="font-[400] text-sm">
                Thêm điểm đón
              </ButtonText>
            </Button>
          </HStack>
        </VStack>
      </OnlyCustomer>
    </VStack>
  );
});

export default HomeHeader;

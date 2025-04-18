import React from "react";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { wrapTextStyle } from "../../theme/AppStyles";
import { Button, ButtonText } from "../ui/button";
import AddIconInLine from "../icons/AddIconInline";
import OnlyCustomer from "../View/OnlyCustomer";
import { Pressable, Text } from "react-native";
import { router } from "expo-router";
import LocationIcon from "../icons/LocationIcon";
import AddIcon from "../icons/AddIcon";
import AppColors from "../../constants/colors";
import { resetPost } from "../../store/postForm/postFormSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { scale } from "react-native-size-matters";
import HomeListUserLocation from "./HomeListUserLocation";

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
          className="p-2 border-0 bg-xedi-primary/[0.2] mb-4 mx-2 rounded-xl"
        >
          <Pressable
            onPress={() => {
              dispatch(resetPost({inputSelectionType: 'end-location'}));
              router.navigate("/trip/create?type=end-location");
            }}
          >
            <HStack
              space="md"
              className="p-4 rounded-md items-center bg-xedi-background"
            >
              <LocationIcon size={scale(20)} color={AppColors.warning} />
              <Text
                style={wrapTextStyle(
                  { fontWeight: "500", color: AppColors.text },
                  "sm"
                )}
              >
                Bạn muốn đến đâu
              </Text>
            </HStack>
          </Pressable>
          <HomeListUserLocation />
        </VStack>
      </OnlyCustomer>
    </VStack>
  );
});

export default HomeHeader;

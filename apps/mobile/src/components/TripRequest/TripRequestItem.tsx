import React, { useMemo } from "react";
import { Box } from "@/src/components/ui/box";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { router } from "expo-router";
import moment from "moment";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import HiIcon from "@/src/components/icons/HiIcon";
import FixedRouteIcon from "@/src/components/icons/FixedRouteIcon";
import { splitLocation } from "@/src/utils";
import { wrapTextStyle } from "@/src/theme/AppStyles";
import AppColors from "@/src/constants/colors";
import { Text } from "react-native";
import "moment/locale/vi"; // Import the Vietnamese locale
// Set the locale globally for moment (optional, but good practice if you use it often)
moment.locale("vi");
const TripRequestItem: React.FC<{
  tripRequest: ITripRequest;
  disabled?: boolean;
  className?: string;
}> = ({ tripRequest: item, disabled, className }) => {
  const { title: startTitle, subTitle: startSubTitle } = useMemo(
    () => splitLocation(item.startLocation.display_name),
    []
  );
  const { title: endTitle, subTitle: endSubTitle } = useMemo(
    () => splitLocation(item.endLocation.display_name),
    []
  );
  return (
    <VStack
      space="md"
      className={`mx-2 bg-xedi-card p-4 rounded-md ${className}`}
    >
      {item?.status === 0 && (
        <Text
          style={wrapTextStyle(
            { fontWeight: "500", color: AppColors.contrast },
            "2xs"
          )}
        >
          Đang tìm xe...
        </Text>
      )}
      <HStack className="justify-between items-center">
        {!!item.departureTime && (
          <Text style={wrapTextStyle({ fontWeight: "700" }, "sm")}>
            {moment(item.departureTime).format("HH:mm")}
          </Text>
        )}
        {!item.departureTime && (
          <Text style={wrapTextStyle({ fontWeight: "700" }, "sm")}>
            Thời gian linh động
          </Text>
        )}
        {!!item.departureTime && (
          <Text style={wrapTextStyle({ fontWeight: "700" }, "2xs")}>
            {moment(item.departureTime).format("DD/MM/YYYY")}
          </Text>
        )}
      </HStack>
      <VStack space="lg">
        <HStack space="md" className="items-center">
          <Box className="w-[15px] h-[15px] p-[3px] justify-center items-center">
            <HiIcon size={24} color="#000000" />
          </Box>
          <VStack>
            <Text style={wrapTextStyle({ fontWeight: "700" }, "sm")}>
              {startTitle}
            </Text>
            {!!startSubTitle && (
              <Text
                style={wrapTextStyle(
                  { fontWeight: "500", color: AppColors.placeholder },
                  "2xs"
                )}
              >
                {startSubTitle}
              </Text>
            )}
          </VStack>
        </HStack>
        <HStack space="md" className="items-center">
          <Box className="w-[15px] h-[15px] p-[3px] justify-center items-center">
            <FixedRouteIcon size={24} color="#000000" />
          </Box>
          <VStack>
            <Text style={wrapTextStyle({ fontWeight: "700" }, "sm")}>
              {endTitle}
            </Text>
            {!!endSubTitle && (
              <Text
                style={wrapTextStyle(
                  { fontWeight: "500", color: AppColors.placeholder },
                  "2xs"
                )}
              >
                {endSubTitle}
              </Text>
            )}
          </VStack>
        </HStack>
      </VStack>
      {!disabled && (
        <HStack space="sm" className="justify-end mt-2">
          <Button
            size="xs"
            className="bg-blue-500 rounded-lg"
            onPress={() => router.navigate(`/trip/${item.id}/detail`)}
          >
            <ButtonText className="text-white">Chi tiết</ButtonText>
          </Button>
        </HStack>
      )}
    </VStack>
  );
};

export default TripRequestItem;

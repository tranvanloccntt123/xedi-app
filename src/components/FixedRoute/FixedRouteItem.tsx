import React, { useMemo } from "react";
import { Box } from "@/src/components/ui/box";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { router } from "expo-router";
import moment from "moment";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import { formatMoney } from "@/src/utils/formatMoney";
import HiIcon from "../icons/HiIcon";
import FixedRouteIcon from "../icons/FixedRouteIcon";
import { splitLocation } from "../../utils";
import { Divider } from "../ui/divider";
import AppColors from "@/src/constants/colors";
import { wrapTextStyle } from "@/src/theme/AppStyles";
import { Text } from "react-native";
import "moment/locale/vi"; // Import the Vietnamese locale
// Set the locale globally for moment (optional, but good practice if you use it often)
moment.locale("vi");
const APP_STRUCT = "FIXED_ROUTES_ITEM";

const FixedRouteItem: React.FC<{
  fixedRoute: IFixedRoute;
  disabled?: boolean;
  className?: string;
  isHiddenPrice?: boolean;
}> = ({ fixedRoute: item, disabled, className, isHiddenPrice }) => {
  const { title: startTitle, subTitle: startSubTitle } = useMemo(
    () =>
      splitLocation(item?.startLocation?.display_name) ?? {
        title: "",
        subTitle: "",
      },
    []
  );
  const { title: endTitle, subTitle: endSubTitle } = useMemo(
    () =>
      splitLocation(item?.endLocation?.display_name) ?? {
        title: "",
        subTitle: "",
      },
    []
  );
  return (
    <VStack
      space="md"
      className={`mx-2 bg-xedi-card p-4 rounded-md ${className}`}
    >
      <HStack className="justify-between h-[30px]">
        {!!item.departureTime && (
          <Text style={wrapTextStyle({ fontWeight: "700" }, "2xs")}>
            {moment(item.departureTime).format("HH:mm")}
          </Text>
        )}
        {!item.departureTime && (
          <Text style={wrapTextStyle({ fontWeight: "700" }, "2xs")}>
            Thời gian linh động
          </Text>
        )}
        <HStack space="sm">
          {item.status === 2 && (
            <Text
              style={wrapTextStyle(
                { fontWeight: "700", color: AppColors.success },
                "2xs"
              )}
            >
              Hoàn thành
            </Text>
          )}
          {!!item.departureTime && (
            <Text style={wrapTextStyle({ fontWeight: "700" }, "2xs")}>
              {moment(item.departureTime).format("DD/MM/YYYY")}
            </Text>
          )}
        </HStack>
      </HStack>
      <VStack space="lg">
        <HStack space="md" className="items-center">
          <Box className="w-[15px] h-[15px] p-[3px] justify-center items-center">
            <HiIcon size={24} color={AppColors.text} />
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
            <FixedRouteIcon size={24} color={AppColors.text} />
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
      {!isHiddenPrice && (
        <>
          <Divider />
          <Text style={wrapTextStyle({ fontWeight: "700" }, "2xs")}>
            Giá: {formatMoney(item.price)} VND
          </Text>
        </>
      )}
      {!disabled && (
        <HStack space="sm" className="justify-end mt-2">
          <Button
            size="xs"
            className="bg-blue-500 rounded-lg"
            onPress={() => router.navigate(`/fixed/${item.id}/detail`)}
          >
            <ButtonText className="text-white">Chi tiết</ButtonText>
          </Button>
        </HStack>
      )}
    </VStack>
  );
};

export default FixedRouteItem;

import React from "react";
import { Box } from "@/src/components/ui/box";
import { Text } from "@/src/components/ui/text";
import type { IFixedRoute } from "@/src/types";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { router } from "expo-router";
import moment from "moment";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import { formatMoney } from "@/src/utils/formatMoney";
import { useDispatch } from "react-redux";
import { setCurrentFixedRoute } from "@/src/store/fixedRoutesSlice";
import { BottomSheetTrigger } from "./ui/bottom-sheet";
import MoreIcon from "@expo/vector-icons/MaterialCommunityIcons";

const APP_STRUCT = "FIXED_ROUTES_ITEM";

const FixedRouteItem: React.FC<{
  fixedRoute: IFixedRoute;
  disabled?: boolean;
  className?: string;
  isHiddenPrice?: boolean;
}> = ({ fixedRoute: item, disabled, className, isHiddenPrice }) => {
  const dispatch = useDispatch();

  const handleMoreClick = () => {
    dispatch(setCurrentFixedRoute(item));
  };

  return (
    <VStack space="xs" className={`mx-2 bg-white p-4 rounded-md ${className}`}>
      <HStack className="justify-between items-center">
        <Text className="text-xs font-bold">
          {moment(item.departureTime).format("HH:mm")}
        </Text>
        <BottomSheetTrigger onPress={handleMoreClick}>
          <MoreIcon color="#000000" size={24} />
        </BottomSheetTrigger>
      </HStack>
      <VStack>
        <HStack className="items-center">
          <Box className="w-[15px] h-[15px] p-[3px] justify-center items-center">
            <Box className="rounded-full w-full h-full bg-error-500" />
          </Box>
          <Text className="font-black font-normal text-sm">
            {item.startLocation.display_name}
          </Text>
        </HStack>
        <Box className="w-[15px] h-[5px] justify-center items-center">
          <Box className="rounded-full w-[3px] h-[3px] bg-primary-100" />
        </Box>
        <Box className="w-[15px] h-[5px] justify-center items-center">
          <Box className="rounded-full w-[3px] h-[3px] bg-primary-100" />
        </Box>
        <HStack className="items-center">
          <Box className="w-[15px] h-[15px] p-[3px] justify-center items-center">
            <Box className="rounded-full w-full h-full bg-error-100" />
          </Box>
          <Text className="font-black font-normal text-sm">
            {item.endLocation.display_name}
          </Text>
        </HStack>
      </VStack>
      {!isHiddenPrice && (
        <Text className="text-sm text-gray-600">
          Giá: {formatMoney(item.price)} VND
        </Text>
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

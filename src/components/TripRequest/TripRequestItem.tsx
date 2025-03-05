import React, { useMemo } from "react";
import { Box } from "@/src/components/ui/box";
import { Text } from "@/src/components/ui/text";
import type { ITripRequest } from "@/src/types";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { router } from "expo-router";
import moment from "moment";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import HiIcon from "@/src/components/icons/HiIcon";
import FixedRouteIcon from "@/src/components/icons/FixedRouteIcon";
import { splitLocation } from "@/src/utils";
import { Heading } from "@/src/components/ui/heading";

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
    <VStack space="md" className={`mx-2 bg-white p-4 rounded-md ${className}`}>
      {item?.status === 0 && <Heading size="sm">Đang tìm xe...</Heading>}
      <HStack className="justify-between items-center">
        {!!item.departureTime && (
          <Text className="text-sm font-bold">
            {moment(item.departureTime).format("HH:mm")}
          </Text>
        )}
        {!item.departureTime && (
          <Text className="text-sm font-bold">Thời gian linh động</Text>
        )}
        {!!item.departureTime && (
          <Text className="text-sm font-bold">
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
            <Text className="text-black font-bold text-lg">{startTitle}</Text>
            {!!startSubTitle && (
              <Text className="text-gray-500 text-md">{startSubTitle}</Text>
            )}
          </VStack>
        </HStack>
        <HStack space="md" className="items-center">
          <Box className="w-[15px] h-[15px] p-[3px] justify-center items-center">
            <FixedRouteIcon size={24} color="#000000" />
          </Box>
          <VStack>
            <Text className="text-black font-bold text-lg">{endTitle}</Text>
            {!!endSubTitle && (
              <Text className="text-gray-500 text-md">{endSubTitle}</Text>
            )}
          </VStack>
        </HStack>
      </VStack>
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

export default TripRequestItem;

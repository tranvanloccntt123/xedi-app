import React, { useEffect } from "react";

import {
  BottomSheetPortal,
  BottomSheetDragIndicator,
  BottomSheetContent,
  BottomSheetItem,
  BottomSheetItemText,
  BottomSheetBackdrop,
} from "@/src/components/ui/bottom-sheet";
import { VStack } from "./ui/vstack";
import { Heading } from "./ui/heading";
import { Center } from "./ui/center";
import { Text } from "./ui/text";
import { ActivityIndicator } from "react-native";
import useReverseLocation from "@/hooks/useReverseLocation";
import { InputLocation } from "../types";

const ReverseLocationBottomSheet: React.FC<{
  coordinate?: {
    lat: number;
    lon: number;
  };
  onCoordinateChange?: (_: InputLocation) => any;
}> = ({ coordinate, onCoordinateChange }) => {
  const { setCoordinate, firstLoadData, data, title, subTitle, isLoading } =
    useReverseLocation();

  useEffect(() => {
    setCoordinate(coordinate);
  }, [coordinate]);

  useEffect(() => {
    if (firstLoadData && onCoordinateChange) {
      const displayName = [
        firstLoadData.features[0]?.properties?.name,
        firstLoadData.features[0]?.properties?.street,
        firstLoadData.features[0]?.properties?.locality,
        firstLoadData.features[0]?.properties?.district,
        firstLoadData.features[0]?.properties?.city,
        firstLoadData.features[0]?.properties?.country,
      ]
        .filter((v) => !!v)
        .join(", ");

      onCoordinateChange?.({
        display_name: displayName,
        lat: firstLoadData.features[0].geometry.coordinates[1],
        lon: firstLoadData.features[0].geometry.coordinates[0],
      });
    }
  }, [firstLoadData]);

  return (
    <BottomSheetPortal
      snapPoints={["20%"]}
      backdropComponent={BottomSheetBackdrop}
      handleComponent={BottomSheetDragIndicator}
    >
      <BottomSheetContent style={{ justifyContent: "flex-end" }}>
        {isLoading ? (
          <Center className="w-full h-full">
            <ActivityIndicator />
          </Center>
        ) : (
          <>
            {!!title && !!subTitle && (
              <BottomSheetItem
                onPress={() => {
                  onCoordinateChange?.({
                    display_name: [title, subTitle]
                      .filter((v) => !!v)
                      .join(","),
                    lat: data.features[0].geometry.coordinates[1],
                    lon: data.features[0].geometry.coordinates[0],
                  });
                }}
              >
                <VStack>
                  <Heading>{title}</Heading>
                  <BottomSheetItemText>{subTitle}</BottomSheetItemText>
                </VStack>
              </BottomSheetItem>
            )}
            <BottomSheetItem>
              <Center className="w-full border-gray-100 border-[1px] p-4 rounded-md">
                <Text className="text-gray-500">Huỷ</Text>
              </Center>
            </BottomSheetItem>
          </>
        )}
      </BottomSheetContent>
    </BottomSheetPortal>
  );
};

export default ReverseLocationBottomSheet;

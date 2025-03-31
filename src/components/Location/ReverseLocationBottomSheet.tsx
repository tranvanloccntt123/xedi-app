import React, { useEffect } from "react";

import {
  BottomSheetPortal,
  BottomSheetDragIndicator,
  BottomSheetItem,
  BottomSheetBackdrop,
  BottomSheetContext,
  BottomSheetScrollView,
} from "@/src/components/ui/bottom-sheet";
import { VStack } from "@/src/components/ui/vstack";
import { Heading } from "@/src/components/ui/heading";
import { Center } from "@/src/components/ui/center";
import { Text } from "@/src/components/ui/text";
import { ActivityIndicator, Pressable } from "react-native";
import useReverseLocation from "@/hooks/useReverseLocation";

const ReverseLocationBottomSheet: React.FC<{
  coordinate?: {
    lat: number;
    lon: number;
  };
  onCoordinateChange?: (_: InputLocation) => any;
  defaultIsOpen?: boolean;
  onPress?: (_: InputLocation) => any;
  isDisableBottomSheet?: boolean;
  topComponent?: React.ReactNode;
  snapPoints?: string[];
  disabledCloseBottomSheet?: boolean;
  enablePanDownToClose?: boolean;
  enableHandlePanningGesture?: boolean;
  enableBackdropPressToClose?: boolean;
}> = ({
  coordinate,
  onCoordinateChange,
  onPress,
  isDisableBottomSheet,
  topComponent,
  snapPoints,
  disabledCloseBottomSheet,
  defaultIsOpen,
  enablePanDownToClose,
  enableHandlePanningGesture}) => {
  const { setCoordinate, firstLoadData, data, title, subTitle, isLoading } =
    useReverseLocation();

  const { handleClose } = React.useContext(BottomSheetContext);

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

  useEffect(() => {
    if (data && isDisableBottomSheet) {
      const displayName = [
        data?.features[0]?.properties?.name,
        data?.features[0]?.properties?.street,
        data?.features[0]?.properties?.locality,
        data?.features[0]?.properties?.district,
        data?.features[0]?.properties?.city,
        data?.features[0]?.properties?.country,
      ]
        .filter((v) => !!v)
        .join(", ");

      onCoordinateChange?.({
        display_name: displayName,
        lat: data?.features[0].geometry.coordinates[1],
        lon: data?.features[0].geometry.coordinates[0],
      });
    }
  }, [isDisableBottomSheet, data]);

  return (
    <BottomSheetPortal
      snapPoints={snapPoints || ["20%"]}
      backdropComponent={BottomSheetBackdrop}
      defaultIsOpen={defaultIsOpen}
      handleComponent={BottomSheetDragIndicator}
      enablePanDownToClose={enablePanDownToClose}
      enableHandlePanningGesture={enableHandlePanningGesture}
      // enableBackdropPressToClose={enableBackdropPressToClose}
    >
      <BottomSheetScrollView>
        {topComponent}
        {isLoading ? (
          <Center className="w-full h-full">
            <ActivityIndicator />
          </Center>
        ) : (
          <>
            {!!title && !!subTitle && (
              <Pressable
                onPress={() => {
                  onCoordinateChange?.({
                    display_name: [title, subTitle]
                      .filter((v) => !!v)
                      .join(","),
                    lat: data.features[0].geometry.coordinates[1],
                    lon: data.features[0].geometry.coordinates[0],
                  });
                  onPress?.({
                    display_name: [title, subTitle]
                      .filter((v) => !!v)
                      .join(","),
                    lat: data.features[0].geometry.coordinates[1],
                    lon: data.features[0].geometry.coordinates[0],
                  });
                  !disabledCloseBottomSheet && handleClose?.();
                }}
              >
                <VStack className="p-4">
                  <Heading>{title}</Heading>
                  <Text>{subTitle}</Text>
                </VStack>
              </Pressable>
            )}
            <BottomSheetItem>
              <Center className="w-full border-gray-100 border-[1px] p-4 rounded-md">
                <Text className="text-gray-500">Huỷ</Text>
              </Center>
            </BottomSheetItem>
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheetPortal>
  );
};

export default ReverseLocationBottomSheet;

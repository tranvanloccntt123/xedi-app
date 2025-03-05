import React from "react";
import {
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetItem,
  BottomSheetItemText,
  BottomSheetPortal,
} from "@/src/components/ui/bottom-sheet";
import { Text } from "../ui/text";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";

const CustomerTripRequestBottomSheet: React.FC<{ isAuthor: boolean }> = ({
  isAuthor,
}) => {
  const request = useSelector((state: RootState) => state.tripRequests.currentDriverTripRequest);
  const handleAccept = async () => {
    
  }
  return (
    <BottomSheetPortal
      snapPoints={["20%"]}
      backdropComponent={BottomSheetBackdrop}
      handleComponent={BottomSheetDragIndicator}
    >
      <BottomSheetContent style={{ justifyContent: "flex-end" }}>
        <BottomSheetItem>
          <BottomSheetItemText>Xác nhận yêu cầu</BottomSheetItemText>
        </BottomSheetItem>
        {isAuthor && (
          <BottomSheetItem onPress={() => {}}>
            <Text className="text-error-300">Từ chối yêu cầu</Text>
          </BottomSheetItem>
        )}
      </BottomSheetContent>
    </BottomSheetPortal>
  );
};

export default CustomerTripRequestBottomSheet;

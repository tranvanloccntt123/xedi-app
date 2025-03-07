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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { xediSupabase } from "@/src/lib/supabase";
import { IDriverTripRequestStatus } from "@/src/types";
import { acceptDriverTripRequest } from "@/src/store/tripRequest/tripRequestsThunk";

const CustomerTripRequestBottomSheet: React.FC<{ isAuthor: boolean }> = ({
  isAuthor,
}) => {
  const request = useSelector(
    (state: RootState) => state.tripRequests.currentDriverTripRequest
  );
  const currentDriverTripRequest = useSelector(
    (state: RootState) => state.tripRequests.currentDriverTripRequest
  );
  const dispatch = useDispatch();
  const handleAccept = async () => {
    if (request)
      dispatch(
        acceptDriverTripRequest({
          driverTripRequestId: currentDriverTripRequest.id,
          tripRequestId: currentDriverTripRequest.trip_request_id,
        })
      );
  };

  const handleDelete = async () => {
    if (request) xediSupabase.tables.driverTripRequests.deleteById(request.id);
  };

  return (
    <BottomSheetPortal
      snapPoints={["20%"]}
      backdropComponent={BottomSheetBackdrop}
      handleComponent={BottomSheetDragIndicator}
    >
      <BottomSheetContent style={{ justifyContent: "flex-end" }}>
        <BottomSheetItem onPress={handleAccept}>
          <BottomSheetItemText>Xác nhận yêu cầu</BottomSheetItemText>
        </BottomSheetItem>
        {isAuthor && (
          <BottomSheetItem onPress={handleDelete}>
            <Text className="text-error-300">Từ chối yêu cầu</Text>
          </BottomSheetItem>
        )}
      </BottomSheetContent>
    </BottomSheetPortal>
  );
};

export default CustomerTripRequestBottomSheet;

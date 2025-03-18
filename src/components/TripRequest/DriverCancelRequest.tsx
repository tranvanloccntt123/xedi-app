import React from "react";
import { Box } from "../ui/box";
import { IDriverTripRequest, IUser } from "@/src/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { XEDI_GROUP_INFO } from "@/src/store/fetchServices/fetchServicesSlice";
import { Button, ButtonText } from "../ui/button";
import useQuery, { useDataInfo } from "@/hooks/useQuery";
import { xediSupabase } from "@/src/lib/supabase";
import { fetchDetailInfo } from "@/src/store/fetchServices/fetchServicesThunk";

const DriverCancelRequest: React.FC<{ tripRequestId: number }> = ({
  tripRequestId,
}) => {
  const dispatch = useDispatch();
  const user: IUser = useSelector((state: RootState) => state.auth.user);
  const queryKey = `${XEDI_GROUP_INFO.DRIVER_TRIP_REQUEST}_${tripRequestId}`;
  const queryFn = async () => {
    try {
      const { data } =
        await xediSupabase.tables.driverTripRequests.selectRequestOrdered({
          tripRequestId: tripRequestId,
          userId: user.id,
        });
      if (data.length) {
        return data[0];
      }
      throw "Not found";
    } catch (e) {
      throw e;
    }
  };

  const { data, isLoading, refetch } = useQuery<IDriverTripRequest>({
    queryFn,
    queryKey,
    disableAutoFetch: true,
  });

  const handleCancelRequest = async () => {
    if (!data) return;
    dispatch(
      fetchDetailInfo({
        key: queryKey,
        async fetch() {
          await xediSupabase.tables.driverTripRequests.deleteById(data.id);
          return queryFn();
        },
      })
    );
  };

  return (
    !!data &&
    !isLoading && (
      <Box className="px-4 py-4">
        <Button
          onPress={handleCancelRequest}
          className="h-[45px] border-error-500"
          variant="outline"
        >
          <ButtonText className="text-error-500">Huỷ yêu cầu</ButtonText>
        </Button>
      </Box>
    )
  );
};

export default DriverCancelRequest;

import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { IDriverTripRequestStatus, ITripRequest } from "@/src/types";
import { xediSupabase } from "@/src/lib/supabase";
import AppLoading from "@/src/components/View/AppLoading";
import TripRequestDetailPending from "@/src/components/TripRequest/TripRequestPending";
import { useDispatch } from "react-redux";
import { fetchDriverTripRequestAccepted } from "@/src/store/tripRequest/tripRequestsThunk";
import TripRequestAccepted from "@/src/components/TripRequest/TripRequestAccepted";
import useQuery from "@/hooks/useQuery";
import { XEDI_GROUP_INFO } from "@/src/store/fetchServices/fetchServicesSlice";
import { fetchDetailInfo } from "@/src/store/fetchServices/fetchServicesThunk";
import TripRequestMerged from "@/src/components/TripRequest/TripRequestMerged";

export default function TripRequestDetail() {
  const { id } = useLocalSearchParams();

  const queryKey = React.useMemo(
    () => `${XEDI_GROUP_INFO.TRIP_REQUEST}_${id}`,
    [id]
  );

  const dispatch = useDispatch();

  const queryFn = async () => {
    const { data, error } = await xediSupabase.tables.tripRequest.selectById(
      id
    );
    if (error) {
      throw error;
    }
    await (
      dispatch(
        fetchDriverTripRequestAccepted({ tripRequestId: id as never })
      ) as any
    ).unwrap();
    return data[0] as ITripRequest;
  };

  const {
    data: tripRequest,
    refetch,
    isLoading: isTripRequestLoading,
  } = useQuery<ITripRequest>({
    queryKey,
    queryFn,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    setTimeout(async () => {
      refetch();
    }, 2000);
  }, []);

  const handlerDriverReject = async (driverRequestId: number) => {
    if (!tripRequest) return;
    dispatch(
      fetchDetailInfo({
        key: queryKey,
        async fetch() {
          await xediSupabase.tables.tripRequest.updateById(tripRequest?.id, {
            status: IDriverTripRequestStatus.PENDING,
          });
          await xediSupabase.tables.fixedRoutes.deleteById(
            driverRequestId
          );
          return queryFn();
        },
      })
    );
  };

  return (
    <AppLoading isLoading={isTripRequestLoading}>
      {tripRequest?.status === IDriverTripRequestStatus.PENDING && (
        <TripRequestDetailPending
          tripRequest={tripRequest}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      )}
      {tripRequest?.status === IDriverTripRequestStatus.CUSTOMER_ACCEPT && (
        <TripRequestAccepted
          tripRequest={tripRequest}
          onReject={handlerDriverReject}
        />
      )}
      {tripRequest?.status ===
        IDriverTripRequestStatus.DRIVER_MERGED_TRIP_REQUEST &&
        tripRequest?.fixed_route_id && (
          <TripRequestMerged
            tripRequest={tripRequest}
            onReject={handlerDriverReject}
          />
        )}
    </AppLoading>
  );
}

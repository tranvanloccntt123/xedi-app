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

export default function TripRequestDetail() {
  const { id } = useLocalSearchParams();

  const dispatch = useDispatch();

  const {data: tripRequest, refetch, isLoading: isTripRequestLoading} = useQuery({
    queryKey: `${XEDI_GROUP_INFO.TRIP_REQUEST}_${id}`,
    async queryFn() {
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
      return data[0];
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState(false);

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    setTimeout(async () => {
      refetch();
    }, 2000);
  }, []);

  const handlerRunning = React.useCallback(async () => {
    if (!tripRequest) return;
    // setIsLoading(true);
    // const { error } = await xediSupabase.tables.tripRequest.runningFixedRoute(
    //   fixedRoute.id
    // );
    // if (error) {
    //   setIsLoading(false);
    //   return;
    // }
    // setFixedRoute({ ...fixedRoute, status: 1 });
  }, [tripRequest]);

  const handlerDriverReject = async (driverRequestId: number) => {
    if (!tripRequest) return;
    setIsLoading(true);
    try {
      await xediSupabase.tables.tripRequest.updateById(tripRequest?.id, {
        status: IDriverTripRequestStatus.PENDING,
      });
      await xediSupabase.tables.driverTripRequests.deleteById(driverRequestId);
      await refetch();
    } catch (e) {}
    setIsLoading(false);
  };

  return (
    <AppLoading isLoading={isLoading || isTripRequestLoading}>
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
    </AppLoading>
  );
}

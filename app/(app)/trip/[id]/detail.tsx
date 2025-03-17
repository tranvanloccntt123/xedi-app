import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { IDriverTripRequestStatus, ITripRequest } from "@/src/types";
import { xediSupabase } from "@/src/lib/supabase";
import AppLoading from "@/src/components/View/AppLoading";
import TripRequestDetailPending from "@/src/components/TripRequest/TripRequestPending";
import { useDispatch } from "react-redux";
import { fetchDriverTripRequestAccepted } from "@/src/store/tripRequest/tripRequestsThunk";
import TripRequestAccepted from "@/src/components/TripRequest/TripRequestAccepted";

export default function TripRequestDetail() {
  const { id } = useLocalSearchParams();

  const dispatch = useDispatch();

  const [tripRequest, setTripRequest] = useState<ITripRequest>();

  const [isLoading, setIsLoading] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState(false);

  const fetch = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const { data, error } = await xediSupabase.tables.tripRequest.selectById(
      id
    );
    if (data?.[0] && !error) {
      setTripRequest(data[0]);
    } else {
      setError(true);
    }
    await (
      dispatch(
        fetchDriverTripRequestAccepted({ tripRequestId: id as never })
      ) as any
    ).unwrap();
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetch();
  }, [id]); // Added isLoading to dependencies

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    setTimeout(async () => {
      fetch(); // Just reverse the order for demo purposes
      setIsRefreshing(false);
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
    setIsLoading(false);
  }, [tripRequest]);

  const handlerDriverReject = async (driverRequestId: number) => {
    if (!tripRequest) return;
    setIsLoading(true);
    try {
      await xediSupabase.tables.tripRequest.updateById(tripRequest?.id, {
        status: IDriverTripRequestStatus.PENDING,
      });
      await xediSupabase.tables.driverTripRequests.deleteById(driverRequestId);
      await fetch();
    } catch (e) {}
    setIsLoading(false);
  };

  const handlerFinished = React.useCallback(async () => {
    if (!tripRequest) return;
    setIsLoading(true);
    const { error } = await xediSupabase.tables.fixedRoutes.finishedFixedRoute(
      tripRequest.id
    );
    if (error) {
      setIsLoading(false);
      return;
    }
    setTripRequest({ ...tripRequest, status: 2 });
    setIsLoading(false);
  }, [tripRequest]);

  console.log(tripRequest?.status);

  return (
    <AppLoading isLoading={isLoading}>
      {tripRequest?.status === IDriverTripRequestStatus.PENDING && (
        <TripRequestDetailPending
          tripRequest={tripRequest}
          isRefreshing={false}
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

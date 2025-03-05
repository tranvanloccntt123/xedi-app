import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ITripRequest } from "@/src/types";
import { xediSupabase } from "@/src/lib/supabase";
import AppLoading from "@/src/components/View/AppLoading";
import TripRequestDetailPending from "@/src/components/TripRequest/TripRequestPending";

export default function TripRequestDetail() {
  const { id } = useLocalSearchParams();
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

  return (
    <AppLoading isLoading={isLoading}>
      <TripRequestDetailPending
        tripRequest={tripRequest}
        isRefreshing={false}
        onRefresh={function () {
          // throw new Error("Function not implemented.");
        }}
        onRunning={function () {
          // throw new Error("Function not implemented.");
        }}
        onFinished={function () {
          // throw new Error("Function not implemented.");
        }}
      />
    </AppLoading>
  );
}

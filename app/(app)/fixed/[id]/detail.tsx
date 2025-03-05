const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { IFixedRouteStatus, type IFixedRoute } from "@/src/types";
import { xediSupabase } from "@/src/lib/supabase";
import AppLoading from "@/src/components/View/AppLoading";
import FixedRouteDetailPending from "@/src/components/FixedRoute/FixedRouteDetailPending";
import FixedRouteDetailRunning from "@/src/components/FixedRoute/FixedRouteDetailRunning";
import FixedRouteDetailFinished from "@/src/components/FixedRoute/FixedRouteDetailFinished";

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: 500,
  },
});

export default function FixedRouteDetail() {
  const { id } = useLocalSearchParams();
  const [fixedRoute, setFixedRoute] = useState<IFixedRoute>();

  const [isLoading, setIsLoading] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState(false);

  const fetch = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const { data, error } = await xediSupabase.tables.fixedRoutes.selectById(
      id
    );
    if (data?.[0] && !error) {
      setFixedRoute(data[0]);
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
    if (!fixedRoute) return;
    setIsLoading(true);
    const { error } = await xediSupabase.tables.fixedRoutes.runningFixedRoute(
      fixedRoute.id
    );
    if (error) {
      setIsLoading(false);
      return;
    }
    setFixedRoute({ ...fixedRoute, status: 1 });
    setIsLoading(false);
  }, [fixedRoute]);

  const handlerFinished = React.useCallback(async () => {
    if (!fixedRoute) return;
    setIsLoading(true);
    const { error } = await xediSupabase.tables.fixedRoutes.finishedFixedRoute(
      fixedRoute.id
    );
    if (error) {
      setIsLoading(false);
      return;
    }
    setFixedRoute({ ...fixedRoute, status: 2 });
    setIsLoading(false);
  }, [fixedRoute]);

  return (
    <AppLoading isLoading={isLoading}>
      {fixedRoute?.status === IFixedRouteStatus.PENDING && (
        <FixedRouteDetailPending
          fixedRoute={fixedRoute}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
          onRunning={handlerRunning}
          onFinished={handlerFinished}
        />
      )}
      {fixedRoute?.status === IFixedRouteStatus.RUNNING && (
        <FixedRouteDetailRunning
          fixedRoute={fixedRoute}
          onFinished={handlerFinished}
        />
      )}
      {fixedRoute?.status === IFixedRouteStatus.FINISHED && (
        <FixedRouteDetailFinished fixedRoute={fixedRoute} />
      )}
    </AppLoading>
  );
}

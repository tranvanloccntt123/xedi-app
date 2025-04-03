const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { xediSupabase } from "@/src/lib/supabase";
import AppLoading from "@/src/components/View/AppLoading";
import FixedRouteDetailPending from "@/src/components/FixedRoute/FixedRouteDetailPending";
import FixedRouteDetailRunning from "@/src/components/FixedRoute/FixedRouteDetailRunning";
import FixedRouteDetailFinished from "@/src/components/FixedRoute/FixedRouteDetailFinished";
import useQuery from "@/hooks/useQuery";
import { XEDI_GROUP_INFO } from "@/src/store/fetchServices/fetchServicesSlice";
import { useDispatch } from "react-redux";
import { fetchDetailInfo } from "@/src/store/fetchServices/fetchServicesThunk";
import { IFixedRouteStatus } from "@/src/types/enum";

export default function FixedRouteDetail() {
  const { id } = useLocalSearchParams();

  const queryKey = React.useMemo(
    () => `${XEDI_GROUP_INFO.FIXED_ROUTE}_${id}`,
    [id]
  );

  const dispatch = useDispatch();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: fixedRoute,
    refetch,
    isLoading: isFixedRouteLoading,
  } = useQuery({
    queryKey: queryKey,
    async queryFn() {
      const { data, error } = await xediSupabase.tables.fixedRoutes.selectById(
        id
      );
      if (error) {
        throw error;
      }
      return data[0];
    },
  });

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    setTimeout(async () => {
      refetch(); // Just reverse the order for demo purposes
      setIsRefreshing(false);
    }, 2000);
  }, []);

  const handlerRunning = React.useCallback(async () => {
    if (!fixedRoute) return;
    dispatch(
      fetchDetailInfo({
        key: queryKey,
        async fetch() {
          const { error } =
            await xediSupabase.tables.fixedRoutes.runningFixedRoute(
              fixedRoute.id
            );
          if (error) {
            throw error;
          }
          return { ...fixedRoute, status: IFixedRouteStatus.RUNNING };
        },
      })
    );
  }, [fixedRoute]);

  const handlerFinished = React.useCallback(async () => {
    if (!fixedRoute) return;
    dispatch(
      fetchDetailInfo({
        key: queryKey,
        async fetch() {
          const { error } =
            await xediSupabase.tables.fixedRoutes.finishedFixedRoute(
              fixedRoute.id
            );
          if (error) {
            throw error;
          }
          return { ...fixedRoute, status: IFixedRouteStatus.FINISHED };
        },
      })
    );
  }, [fixedRoute]);

  return (
    <AppLoading isLoading={isFixedRouteLoading}>
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

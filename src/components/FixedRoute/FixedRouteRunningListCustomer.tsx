import { Tables } from "@/src/constants";
import { xediSupabase } from "@/src/lib/supabase";
import { RootState } from "@/src/store/store";
import {
  IFixedRoute,
  IFixedRouteOrder,
  InputLocation,
  ITripRequest,
  IUser,
} from "@/src/types";
import React from "react";
import { useSelector } from "react-redux";

type CustomerInFixedRoute = {
  user: IUser;
  startLocation: InputLocation;
  endLocation: InputLocation;
};

const FixedRouteRunningListCustomer: React.FC<{
  fixedRoute: IFixedRoute;
}> = ({ fixedRoute }) => {
  const user: IUser = useSelector((state: RootState) => state.auth.user);

  const isAuthor = React.useMemo(
    () => user?.id === fixedRoute?.user_id,
    [user, fixedRoute]
  );

  const [fixedRouteRequestList, setFixedRouteRequestList] = React.useState<
    IFixedRouteOrder[]
  >([]);

  const [mergeRequestList, setMergeRequestList] = React.useState<
    ITripRequest[]
  >([]);

  const customerList = React.useMemo(() => {
    const list: CustomerInFixedRoute[] = [];

    if (fixedRouteRequestList.length) {
      list.push(
        ...fixedRouteRequestList.map((v) => ({
          user: v.users,
          startLocation: v.location,
          endLocation: fixedRoute.endLocation,
        }))
      );
    }

    if (mergeRequestList.length) {
      list.push(
        ...mergeRequestList.map((v) => ({
          user: v.users,
          startLocation: v.startLocation,
          endLocation: v.endLocation,
        }))
      );
    }

    return list;
  }, [mergeRequestList, fixedRouteRequestList]);

  const loadMergeData = async () => {
    const { data: mergeRequest } =
      await xediSupabase.tables.tripRequest.selectAfterId({
        select: `*, ${Tables.USERS} (*)`,
        filter: [
          {
            filed: "fixed_route_id",
            filter: "eq",
            data: fixedRoute.id,
          },
        ],
      });
    setMergeRequestList(mergeRequest as never);
  };

  const loadData = async () => {
    const { data, error } =
      await xediSupabase.tables.fixedRouteOrders.selectOrderByStatus(
        fixedRoute.id
      );
    if (error) return;
    setFixedRouteRequestList(data as never);
  };

  React.useEffect(() => {
    if (!!fixedRoute && isAuthor) {
      loadMergeData();
      loadData();
    }
  }, [isAuthor, fixedRoute]);

  return <></>;
};

export default FixedRouteRunningListCustomer;

import React from "react";
import { IFixedRoute, IFixedRouteOrder, IUser } from "@/src/types";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { xediSupabase } from "@/src/lib/supabase";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import { HStack } from "@/src/components/ui/hstack";
import { Heading } from "@/src/components/ui/heading";
import { Button } from "@/src/components/ui/button";
import { useNavigation } from "expo-router";
import FixedRouteOrderItem from "./FixedRouteOrderItem";

const FixedRouteRequestList: React.FC<{
  fixedRoute: IFixedRoute;
  isRefreshing?: boolean;
  onFixedRouteOrder?: () => any;
}> = ({ fixedRoute, isRefreshing, onFixedRouteOrder }) => {
  const navigation = useNavigation();
  const focused = navigation.isFocused();
  const user: IUser = useSelector((state: RootState) => state.auth.user);
  const isAuthor = React.useMemo(() => user.id === fixedRoute?.user_id, []);
  const [listFixedRouteRequest, setFixedRouteRequest] = React.useState<
    IFixedRouteOrder[]
  >([]);

  const loadData = async () => {
    if (!isAuthor) {
      const { data, error } =
        await xediSupabase.tables.fixedRouteOrders.selectOrderByStatus(
          fixedRoute.id,
          user.id
        );
      if (error) return;
      setFixedRouteRequest(data as never);
      return;
    }
    const { data, error } =
      await xediSupabase.tables.fixedRouteOrders.selectOrderByStatus(
        fixedRoute.id
      );
    if (error) return;
    setFixedRouteRequest(data as never);
  };

  React.useEffect(() => {
    if (user?.id || isRefreshing || focused) {
      loadData();
    }
  }, [user, isRefreshing, focused]);

  const acceptCountable = React.useMemo(
    () =>
      listFixedRouteRequest.reduce(
        (old, value) => old + (value.status === 1 ? 1 : 0),
        0
      ),
    []
  );

  return (
    <VStack space="md">
      <HStack>
        <Heading className="flex-1">
          {isAuthor ? "Danh sách yêu cầu được gửi đến" : "Yêu cầu của bạn"}
        </Heading>
        {!isAuthor && user.role === "customer" && (
          <Button
            onPress={onFixedRouteOrder}
            disabled={!!listFixedRouteRequest.length}
            className={`rounded-full ${
              !!listFixedRouteRequest.length && "opacity-[50%]"
            }`}
          >
            <Text className="text-white">Đặt</Text>
          </Button>
        )}
      </HStack>
      {listFixedRouteRequest.map((v) => (
        <FixedRouteOrderItem
          fixedRouteOrder={v}
          key={v.id}
          isDisabled={
            !isAuthor || (acceptCountable || 0) >= (fixedRoute.totalSeats || 0)
          }
          onDeleted={() => {
            loadData();
          }}
        />
      ))}
    </VStack>
  );
};

export default FixedRouteRequestList;

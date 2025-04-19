import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { xediSupabase } from "supabase-client";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import { HStack } from "@/src/components/ui/hstack";
import { Heading } from "@/src/components/ui/heading";
import { Button } from "@/src/components/ui/button";
import { useNavigation } from "expo-router";
import FixedRouteOrderItem from "./FixedRouteOrderItem";
import { Center } from "../ui/center";
import { wrapTextStyle } from "@/src/theme/AppStyles";

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
        <Text
          className="flex-1"
          style={wrapTextStyle({ fontWeight: "700" }, "sm")}
        >
          {isAuthor ? "Danh sách yêu cầu được gửi đến" : "Yêu cầu của bạn"}
        </Text>
        {!isAuthor && user.role === "customer" && (
          <Button
            onPress={onFixedRouteOrder}
            disabled={!!listFixedRouteRequest.length}
            className={`rounded-full ${
              !!listFixedRouteRequest.length && "opacity-[50%]"
            }`}
          >
            <Text
              className="text-white"
              style={wrapTextStyle({ fontWeight: "400" }, "sm")}
            >
              Đặt
            </Text>
          </Button>
        )}
      </HStack>
      {!!listFixedRouteRequest.length &&
        listFixedRouteRequest.map((v) => (
          <FixedRouteOrderItem
            fixedRouteOrder={v}
            key={v.id}
            isDisabled={
              !isAuthor ||
              (acceptCountable || 0) >= (fixedRoute.totalSeats || 0)
            }
            onDeleted={() => {
              loadData();
            }}
          />
        ))}
      {!listFixedRouteRequest.length && (
        <Center className="w-full mt-4 mb-4">
          <Text
            className="text-md"
            style={wrapTextStyle({ fontWeight: "400" }, "2xs")}
          >
            Danh sách trống
          </Text>
        </Center>
      )}
    </VStack>
  );
};

export default FixedRouteRequestList;

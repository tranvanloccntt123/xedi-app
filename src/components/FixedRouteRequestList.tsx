import React from "react";
import { IFixedRoute, IFixedRouteOrder, IUser } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { xediSupabase } from "../lib/supabase";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";
import { HStack } from "./ui/hstack";
import { Heading } from "./ui/heading";
import { Box } from "./ui/box";
import { Button, ButtonText } from "./ui/button";

const FixedRouteOrderItem: React.FC<{
  fixedRouteOrder: IFixedRouteOrder;
  isDisabled: boolean;
}> = ({ fixedRouteOrder, isDisabled }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<IFixedRouteOrder>(fixedRouteOrder);
  const handlerAccept = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await xediSupabase.tables.fixedRouteOrders.acceptFixedRouteOrder(
      fixedRouteOrder.id
    );
    const { data } = await xediSupabase.tables.fixedRouteOrders.selectById(
      fixedRouteOrder.id
    );
    if (data?.length) {
      setData({ ...data[0] });
    }
    setIsLoading(false);
  };

  return (
    <VStack space="sm" key={data.id} className="bg-white rounded-md p-2">
      <HStack space="md" className="justify-between">
        <HStack space="md" className="items-center">
          <Text className="text-lg font-bold">{data.name}</Text>
          <Text className="text-md">{data.phone_number}</Text>
        </HStack>
        <Box
          className={`px-3 py-1 rounded-full ${
            data.status === 0 ? "bg-warning-300" : "bg-success-300"
          }`}
        >
          <Text
            className={`text-sm ${
              data.status === 0 ? "text-warning-900" : "text-success-900"
            }`}
          >
            {data.status === 0 ? "Yêu cầu" : "Đã xác nhận"}
          </Text>
        </Box>
      </HStack>
      {!!data.note && (
        <Box className="border-1 rounded-md bg-gray-100 p-2 h-[120px]">
          <Text>{data.note}</Text>
        </Box>
      )}
      {!isDisabled && data.status === 0 && (
        <Button
          onPress={handlerAccept}
          disabled={isLoading}
          className="rounded-md bg-primary-500"
        >
          <ButtonText>Xác nhận</ButtonText>
        </Button>
      )}
    </VStack>
  );
};

const FixedRouteRequestList: React.FC<{
  fixedRoute: IFixedRoute;
  isRefreshing: boolean;
}> = ({ fixedRoute, isRefreshing }) => {
  const user: IUser = useSelector((state: RootState) => state.auth.user);
  const isAuthor = React.useMemo(() => user.id === fixedRoute?.user_id, []);
  const [listFixedRouteRequest, setFixedRouteRequest] = React.useState<
    IFixedRouteOrder[]
  >([]);

  const loadData = async () => {
    if (!isAuthor) {
      try {
        const { data } =
          await xediSupabase.tables.fixedRouteOrders.selectByUserIdAfterId({
            pageNums: 100,
          });
        setFixedRouteRequest(data as never);
      } catch (e) {}
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
    if (user?.id || isRefreshing) {
      loadData();
    }
  }, [user, isRefreshing]);

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
      {!!listFixedRouteRequest.length && (
        <Heading>
          {isAuthor
            ? "Danh sách yêu cầu được gửi đến"
            : "Danh sách yêu cầu của bạn"}
        </Heading>
      )}
      {listFixedRouteRequest.map((v) => (
        <FixedRouteOrderItem
          fixedRouteOrder={v}
          key={v.id}
          isDisabled={
            !isAuthor || (acceptCountable || 0) >= (fixedRoute.totalSeats || 0)
          }
        />
      ))}
    </VStack>
  );
};

export default FixedRouteRequestList;

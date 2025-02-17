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
import { Button, ButtonSpinner, ButtonText } from "./ui/button";
import { hidePhoneNumber } from "../utils";

const FixedRouteOrderItem: React.FC<{
  fixedRouteOrder: IFixedRouteOrder;
  isDisabled: boolean;
}> = ({ fixedRouteOrder, isDisabled }) => {
  const user: IUser = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<IFixedRouteOrder>(fixedRouteOrder);
  const [errorMessage, setErrorMessage] = React.useState("");
  const handlerAccept = async () => {
    if (isLoading) return;
    setErrorMessage("");
    setIsLoading(true);
    const { data: acceptData, error } =
      await xediSupabase.tables.fixedRouteOrders.acceptFixedRouteOrder(
        fixedRouteOrder.id
      );
    const { data } = await xediSupabase.tables.fixedRouteOrders.selectById(
      fixedRouteOrder.id
    );
    if (!error && data?.length) {
      setData({ ...data[0] });
    }
    if (error) {
      const contextError = await error.context.json();
      if (contextError.error?.message.toLowerCase() === "accept not allowed") {
        setErrorMessage("Bạn không đủ coin để lấy thông tin khách hàng!");
      }
    }
    setIsLoading(false);
  };

  const isRequestAuthor = React.useMemo(
    () => user.id === fixedRouteOrder.user_id,
    []
  );

  return (
    <VStack space="sm" key={data.id} className="bg-white rounded-md p-2">
      <HStack space="md" className="justify-between">
        <HStack space="md" className="items-center">
          <Text className="text-lg font-bold">{data.name}</Text>
          <Text className="text-md">
            {data.status === 1 || isRequestAuthor
              ? data.phone_number
              : hidePhoneNumber(data.phone_number)}
          </Text>
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
      {data.status === 0 && !isDisabled && (
        <Text className="text-warning-500 text-sm">
          * Bạn cần xác nhận để lấy thông tin khách hàng
        </Text>
      )}
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
          {!isLoading && <ButtonText>Xác nhận</ButtonText>}
          {isLoading && <ButtonSpinner color={"#ffffff"} />}
        </Button>
      )}
      {!!errorMessage && (
        <Text className="text-error-500 text-sm">{errorMessage}</Text>
      )}
      {isRequestAuthor && fixedRouteOrder.status === 0 && (
        <Button className="bg-error-500 rounded-full">
          <Text className="text-white">Huỷ</Text>
        </Button>
      )}
    </VStack>
  );
};

const FixedRouteRequestList: React.FC<{
  fixedRoute: IFixedRoute;
  isRefreshing: boolean;
  onFixedRouteOrder: () => any;
}> = ({ fixedRoute, isRefreshing, onFixedRouteOrder }) => {
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
        <HStack>
          <Heading className="flex-1">
            {isAuthor
              ? "Danh sách yêu cầu được gửi đến"
              : "Danh sách yêu cầu của bạn"}
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

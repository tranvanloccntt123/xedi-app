import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { xediSupabase } from "supabase-client";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import { HStack } from "@/src/components/ui/hstack";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/src/components/ui/button";
import { hidePhoneNumber, splitLocation } from "@/src//utils";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const FixedRouteOrderItem: React.FC<{
  fixedRouteOrder: IFixedRouteOrder;
  isDisabled: boolean;
  onDeleted?: () => any;
}> = ({ fixedRouteOrder, isDisabled, onDeleted }) => {
  const user: IUser = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<IFixedRouteOrder>(fixedRouteOrder);
  const [errorMessage, setErrorMessage] = React.useState("");
  const opacity = useSharedValue(1);
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
        setErrorMessage("Bạn không đủ xu để lấy thông tin khách hàng!");
      }
    }
    setIsLoading(false);
  };

  const handlerDelete = async () => {
    if (isLoading) return;
    const { data, error } =
      await xediSupabase.tables.fixedRouteOrders.deleteById(fixedRouteOrder.id);

    if (!error) {
      opacity.value = withTiming(
        0,
        { duration: 500 },
        (finished) => onDeleted && finished && runOnJS(onDeleted)()
      );
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      maxHeight: interpolate(opacity.value, [0, 1], [0, 9999]),
    };
  });

  const isRequestAuthor = React.useMemo(
    () => user.id === fixedRouteOrder.user_id,
    []
  );

  const { title: startTitle, subTitle: startSubTitle } = React.useMemo(
    () => splitLocation(fixedRouteOrder.location.display_name),
    []
  );

  return (
    <Animated.View style={animatedStyle}>
      <VStack space="lg" key={data?.id} className="bg-white rounded-xl p-[16px]">
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
        <VStack space="xs">
          <Text className="text-black font-bold text-lg">{startTitle}</Text>
          {!!startSubTitle && (
            <Text className="text-gray-500 text-md">{startSubTitle}</Text>
          )}
        </VStack>
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
          <Button
            onPress={handlerDelete}
            className="bg-error-500 h-[45px] rounded-full"
          >
            <Text className="text-white text-lg font-bold">Huỷ</Text>
          </Button>
        )}
      </VStack>
    </Animated.View>
  );
};

export default FixedRouteOrderItem;

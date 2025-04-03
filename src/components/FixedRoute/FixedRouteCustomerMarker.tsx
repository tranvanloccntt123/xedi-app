import { useDataInfo } from "@/hooks/useQuery";
import { XEDI_GROUP_INFO } from "@/src/store/fetchServices/fetchServicesSlice";
import { MarkerView } from "@maplibre/maplibre-react-native";
import React from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { MARKER_SIZE, ZOOM_LEVEL } from "@/src/constants";
import { Avatar, AvatarFallbackText } from "../ui/avatar";
import { View } from "react-native";
import PinsFullfield from "../icons/PinsFullfield";
import AppColors from "@/src/constants/colors";

const FixedRouteCustomerMarker: React.FC<{
  fixedRoute: IFixedRoute;
  markerResizeAnim: SharedValue<number>;
}> = ({ fixedRoute, markerResizeAnim }) => {
  const { data } = useDataInfo<CustomerInFixedRoute[]>(
    `${XEDI_GROUP_INFO.CUSTOMER_LIST}_${fixedRoute.id}`
  );

  const markerStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(markerResizeAnim.value, ZOOM_LEVEL, MARKER_SIZE),
      height: interpolate(markerResizeAnim.value, ZOOM_LEVEL, MARKER_SIZE),
    };
  });

  return (
    <>
      {(data || [])
        .filter(
          (customer) =>
            !!customer.startLocation.lon && !!customer.startLocation.lat
        )
        .map((customer) => {
          return (
            <MarkerView
              key={customer.id}
              coordinate={[
                customer.startLocation.lon,
                customer.startLocation.lat,
              ]}
            >
              <Animated.View style={[markerStyle, { alignItems: "center" }]}>
                <PinsFullfield size={"50%"} color={AppColors.primary} />
                <Avatar
                  style={{
                    width: "40%",
                    height: "40%",
                    position: "absolute",
                    top: 0,
                    backgroundColor: AppColors.primary,
                  }}
                >
                  <AvatarFallbackText>{customer.user.name}</AvatarFallbackText>
                </Avatar>
              </Animated.View>
            </MarkerView>
          );
        })}
    </>
  );
};

export default FixedRouteCustomerMarker;

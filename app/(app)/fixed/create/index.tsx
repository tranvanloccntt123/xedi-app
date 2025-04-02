import React from "react";
import { Box } from "@/src/components/ui/box";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/src/components/Header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import AppMapView from "@/src/components/AppMapView";
import useLocation from "@/hooks/useLocation";
import { Center } from "@/src/components/ui/center";
import { MarkerView } from "@maplibre/maplibre-react-native";
import EclipseIcon from "@/src/components/icons/EclipseIcon";
import { StyleSheet } from "react-native";
import BottomSheetGesture from "@/src/components/BottomSheetGesture";
import {
  setFixedRouteDepartureTime,
  setFixedRouteLocation,
  setFixedRoutePrice,
} from "@/src/store/postForm/postFormSlice";
import LocationSearchFixedRoute from "@/src/components/Location/LocationSearchFixedRoute";
import CreatePostPolyline from "@/src/components/Feed/CreatePostPolyline";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import { Divider } from "@/src/components/ui/divider";
import { Input, InputField } from "@/src/components/ui/input";
import { formatMoney, unformatMoney } from "@/src/utils/formatMoney";
import DateTimePicker from "@/src/components/DateTime";
import {
  formValidatePerField,
  formValidateSuccess,
} from "@/src/utils/validator";
import { fixedRouteValidator } from "@/src/constants/validator";
import { router } from "expo-router";
import Animated from "react-native-reanimated";
import PinIcon from "@/src/components/icons/PinIcon";

const EclipseMarker: React.FC<{ coordinate: { lat: number; lon: number } }> = ({
  coordinate,
}) => {
  const { startLocation, endLocation } = useSelector(
    (state: RootState) => state.postForm.fixedRoutes
  );
  return (
    (!startLocation?.display_name || !endLocation?.display_name) &&
    !!coordinate?.lat &&
    !!coordinate?.lon && (
      <MarkerView coordinate={[coordinate.lon, coordinate.lat]}>
        <EclipseIcon size={18} color="#000000" />
      </MarkerView>
    )
  );
};

const PinMarker: React.FC<object> = () => {
  const { startLocation, endLocation } = useSelector(
    (state: RootState) => state.postForm.fixedRoutes
  );
  return (
    (!startLocation?.display_name || !endLocation?.display_name) && (
      <Animated.View style={[styles.pinContainer]}>
        <Box style={{ top: -18 }}>
          <PinIcon size={34} color="#000000" />
        </Box>
      </Animated.View>
    )
  );
};

export default function CreateFixedRoute() {
  useLocation({});
  const { lat, lon } = useSelector((state: RootState) => state.location);
  const fixedRouteTmp = useSelector(
    (state: RootState) => state.postForm.fixedRoutes
  );
  const [price, setPrice] = React.useState<string>(
    fixedRouteTmp.price ? `${fixedRouteTmp.price}` : ""
  );
  const [coordinate, setCoordinate] = React.useState<{
    lat: number;
    lon: number;
  }>({
    lat: lat,
    lon: lon,
  });
  const [departureTime, setDepartureTime] = React.useState(
    fixedRouteTmp.departureTime || new Date()
  );
  const [error, setError] = React.useState({
    price: "",
    departureTime: "",
  });
  const dispatch = useDispatch();
  const bottomSheetRef = React.useRef(null);
  const isFlexDepartureTime = false;
  const handlerConfirm = async () => {
    try {
      const validateForm = formValidatePerField(fixedRouteValidator, {
        startLocation: fixedRouteTmp.startLocation?.display_name,
        endLocation: fixedRouteTmp.endLocation?.display_name,
        price: `${fixedRouteTmp?.price || ""}`,
        departureTime: `${fixedRouteTmp?.departureTime || ""}`,
      });
      setError({
        price: validateForm.price?.message || "",
        departureTime: validateForm.departureTime?.message || "",
      });
      if (!formValidateSuccess(validateForm)) {
        return;
      }
      router.back();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Box className="flex-1 bg-xedi-background">
      <SafeAreaView style={{ flex: 1 }}>
        <Box className="px-4">
          <Header
            title="Bắt đầu hành trình mới"
            subTitle="Chúc bạn có một hành trình an toàn!"
          />
        </Box>
        <Center className="flex-1 w-full">
          <AppMapView
            onCenterChange={(location) => {
              setCoordinate(location);
            }}
          >
            <CreatePostPolyline type={"fixed-route"} />
            <EclipseMarker coordinate={coordinate} />
          </AppMapView>
          <PinMarker />
        </Center>
      </SafeAreaView>
      <BottomSheetGesture
        coordinate={coordinate}
        onPress={(location) => dispatch(setFixedRouteLocation(location))}
        ref={bottomSheetRef}
        isDisableFetchRemind={
          !!fixedRouteTmp.startLocation && !!fixedRouteTmp.endLocation
        }
        locationSearchComponent={
          <VStack space="md">
            <LocationSearchFixedRoute
              onConfirm={handlerConfirm}
              isShareHide={true}
              onQueryFullfiled={() => bottomSheetRef.current?.openFull()}
            />
            {!!fixedRouteTmp.startLocation && !!fixedRouteTmp.endLocation && (
              <>
                <Divider />
                <Box>
                  <Text className="font-bold mb-2">Giá thành (VND)</Text>
                  <Input className="h-[55px] rounded-lg mb-2">
                    <InputField
                      value={!price ? "" : formatMoney(price)}
                      onChangeText={(value) => {
                        const numericValue = unformatMoney(value);
                        if (!isNaN(numericValue)) {
                          setPrice(numericValue.toString());
                          dispatch(setFixedRoutePrice(numericValue));
                        } else {
                          setPrice("");
                          dispatch(setFixedRoutePrice(0));
                        }
                        // setErrors({ ...errors, price: "" });
                      }}
                      keyboardType="numeric"
                      placeholder="Nhập giá tiền"
                    />
                  </Input>
                  {!!error.price && (
                    <Text className="text-red-500 text-sm mt-1">
                      {error.price}
                    </Text>
                  )}
                </Box>
                <Divider />
                <Box>
                  <Text
                    className={`${
                      isFlexDepartureTime ? "text-typography-300" : "text-black"
                    } font-bold mb-2`}
                  >
                    Khởi hành lúc
                  </Text>
                  <DateTimePicker
                    isDisabled={isFlexDepartureTime}
                    date={departureTime}
                    onChangeDate={(date) => {
                      setDepartureTime(date);
                      dispatch(setFixedRouteDepartureTime(date));
                      // setErrors({ ...errors, departureTime: "" });
                    }}
                  />
                  {!!error.departureTime && (
                    <Text className="text-red-500 text-sm mt-1">
                      {error.departureTime}
                    </Text>
                  )}
                </Box>
              </>
            )}
          </VStack>
        }
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  pinContainer: {
    position: "absolute",
  },
});

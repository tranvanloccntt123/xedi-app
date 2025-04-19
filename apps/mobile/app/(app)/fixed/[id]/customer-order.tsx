import useLocation from "@/hooks/useLocation";
import AppMapView from "@/src/components/AppMapView";
import FixedRouteOrder from "@/src/components/FixedRoute/FixedRouteOrder";
import Header from "@/src/components/Header";
import ReverseLocationBottomSheet from "@/src/components/Location/ReverseLocationBottomSheet";
import { BottomSheet } from "@/src/components/ui/bottom-sheet";
import { Box } from "@/src/components/ui/box";
import { Button } from "@/src/components/ui/button";
import { Divider } from "@/src/components/ui/divider";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { xediSupabase } from "supabase-client";
import { RootState } from "@/src/store/store";
import { splitLocation } from "@/src/utils";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function FixedRouteCustomerOrder() {
  useLocation({ isWatchLocation: true });
  const { lat, lon } = useSelector((state: RootState) => state.location);
  const { id } = useLocalSearchParams();
  const user: IUser = useSelector((state: RootState) => state.auth.user);
  const formData = React.useRef<FixedRouteOrderForm>({
    name: "",
    note: "",
    phone: "",
  });
  const [fixedRouteOrderVisible, setFixedRouteOrderVisible] = useState(true);
  const [entryLocation, setEntryLocation] = useState<InputLocation>();
  const [coordinate, setCoordinate] = React.useState<{
    lat: number;
    lon: number;
  }>({
    lat: lat,
    lon: lon,
  });

  const { title, subTitle } = useMemo(
    () => splitLocation(entryLocation?.display_name || ""),
    [entryLocation]
  );

  const handleFixedRoute = async () => {
    if ([formData.current.name, formData.current.phone].includes("")) {
      setFixedRouteOrderVisible(true);
      return;
    }

    const { data, error } = await xediSupabase.tables.fixedRouteOrders.add([
      {
        fixed_route_id: id,
        user_id: user.id,
        name: formData.current.name,
        phone_number: formData.current.phone,
        note: formData.current.note,
        location: formData.current.location,
      },
    ]);
    if (!error) {
      router.back();
    }
  };

  return (
    <BottomSheet>
      <Box className="flex-1">
        <SafeAreaView style={{ flex: 1 }}>
          <Box className="px-4">
            <Header
              title="Hành trình"
              rightComponent={
                <Button
                  // onPress={onFixedRouteOrder}
                  // disabled={!!listFixedRouteRequest.length}
                  onPress={handleFixedRoute}
                  className={`rounded-full`}
                >
                  <Text className="text-white">Đặt</Text>
                </Button>
              }
            />
          </Box>
          <AppMapView isOpenTrigger={true} onPress={(c) => setCoordinate(c)} />
          <Box className="shadow-sm absolute h-[150px] z-index-9 bg-white bottom-[40px] left-[16px] right-[16px] rounded-[22px] p-[18px]">
            <VStack space="sm">
              <Text className="font-bold text-black text-lg w-full">
                {title}
              </Text>
              {!!subTitle && (
                <>
                  <Divider />
                  <Text className="text-md text-gray-500 w-full">
                    {subTitle}
                  </Text>
                </>
              )}
            </VStack>
          </Box>
        </SafeAreaView>
        <ReverseLocationBottomSheet
          coordinate={coordinate}
          onCoordinateChange={(location) =>
            (formData.current.location = location) && setEntryLocation(location)
          }
        />
        {user?.role === "customer" && (
          <FixedRouteOrder
            visible={fixedRouteOrderVisible}
            onClose={() => setFixedRouteOrderVisible(false)}
            user={user}
            fixedRouteId={id}
            onSuccess={(data) => {
              formData.current.name = data.name;
              formData.current.phone = data.phoneNumber;
              formData.current.note = data.note;
            }}
          />
        )}
      </Box>
    </BottomSheet>
  );
}

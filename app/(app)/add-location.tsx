import React from "react";
import useLocation from "@/hooks/useLocation";
import { Box } from "@/src/components/ui/box";
import AppMapView from "@/src/components/AppMapView";
import Header from "@/src/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import EclipseMarkerIcon from "@/src/components/EclipseMarkerIcon";
import { Center } from "@/src/components/ui/center";
import PinMarkerIcon from "@/src/components/PrinMarkerIcon";
import BottomSheetGesture from "@/src/components/BottomSheetGesture";
import { StatusBar } from "react-native";
import useUserLocation from "@/hooks/useUserLocation";
import { DEFAULT_LOCATION } from "@/src/constants";
import { ScaledSheet } from "react-native-size-matters";
import useQuery from "@/hooks/useQuery";
import { XEDI_QUERY_KEY } from "@/src/store/fetchServices/fetchServicesSlice";
import {xediSupabase, supabase} from 'supabase-client';
import ConfirmationModal from "@/src/components/Location/ConfirmationModal";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { router } from "expo-router";

export default function AddLocation() {
  useLocation({ isWatchLocation: true });

  const user = useSelector((state: RootState) => state.auth.user);

  const { refetch, data } = useQuery({
    queryKey: XEDI_QUERY_KEY.YOUR_LOCATIONS_STORED,
    async queryFn() {
      const { data } =
        await xediSupabase.tables.userLocationStore.selectByUserIdAfterDate({
          pageNums: 4,
        });
      return data || [];
    },
  });

  const { lat, lon } = useUserLocation(DEFAULT_LOCATION);

  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);

  const [coordinate, setCoordinate] = React.useState<{
    lat: number;
    lon: number;
  }>({
    lat: lat,
    lon: lon,
  });

  const [location, setLocation] = React.useState<InputLocation>();

  return (
    <Box className="flex-1">
      <StatusBar translucent backgroundColor={"transparent"} />
      <SafeAreaView style={{ flex: 1 }}>
        <Box className="px-4">
          <Header title="Thêm điểm đón" />
        </Box>
        <Center className="flex-1">
          <AppMapView onCenterChange={(c) => setCoordinate(c)}>
            <EclipseMarkerIcon coordinate={coordinate} />
          </AppMapView>
          <PinMarkerIcon />
        </Center>
      </SafeAreaView>
      <BottomSheetGesture
        coordinate={coordinate}
        onPress={(location) => {
          setLocation(location);
          setShowConfirmationModal(true);
        }}
      />
      <ConfirmationModal
        location={location}
        showConfirmationModal={showConfirmationModal}
        setShowConfirmationModal={setShowConfirmationModal}
        onConfirm={() => {
          xediSupabase.tables.userLocationStore
            .add([
              {
                user_id: user.id,
                location: location,
              },
            ])
            .then((response) => {
              const { data } = response;
              if (!!data) {
                refetch?.();
                router.back();
              }
            });
        }}
      />
    </Box>
  );
}

const styles = ScaledSheet.create({});

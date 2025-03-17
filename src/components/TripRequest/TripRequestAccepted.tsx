import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Button, ButtonIcon } from "@/src/components/ui/button";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { ITripRequest, IUser } from "@/src/types";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootState } from "@/src/store/store";
import Header from "@/src/components/Header";
import { EditIcon } from "@/src/components/ui/icon";
import TripRequestItem from "./TripRequestItem";
import CustomerTripRequestList from "./CustomerTripRequestList";
import { BottomSheet } from "../ui/bottom-sheet";
import CustomerTripRequestBottomSheet from "./CustomerTripRequestBottomSheet";
import DriverTripRequestPending from "./DriverTripRequestPending";

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: 500,
  },
});

const TripRequestAccepted: React.FC<{ tripRequest: ITripRequest }> = ({
  tripRequest,
}) => {
  const user: IUser = useSelector((state: RootState) => state.auth.user);

  const isAuthor = React.useMemo(
    () => user && tripRequest && user.id === tripRequest?.user_id,
    [user, tripRequest]
  );
  return (
    <Box className="flex-1 bg-gray-100">
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <Box className="flex-1 px-4 bg-gray-100">
            <VStack space="md">
              <Header title="Chi tiết hành trình" />
              {!!tripRequest && (
                <TripRequestItem
                  className="mx-0"
                  tripRequest={tripRequest}
                  disabled
                />
              )}
              {!isAuthor && tripRequest && user.role === "driver" && (
                <DriverTripRequestPending tripRequestId={tripRequest.id} />
              )}
              {isAuthor && (
                <CustomerTripRequestList tripRequestId={tripRequest.id} />
              )}
            </VStack>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

export default TripRequestAccepted;

import React from "react";
import { Button, ButtonText } from "@/src/components/ui/button";
import ChevronRightIcon from "../icons/ChevronRightIcon";
import { router } from "expo-router";
import TripRequestDriverHandleLayout from "./TripRequestDriverHandleLayout";

const TripRequestAccepted: React.FC<{
  tripRequest: ITripRequest;
  onReject?: (driverTripRequestId: number) => any;
}> = ({ tripRequest, onReject }) => {
  return (
    <TripRequestDriverHandleLayout
      tripRequest={tripRequest}
      onReject={onReject}
      mergeComponent={
        <Button
          onPress={() => router.navigate(`trip/${tripRequest.id}/merge`)}
          className="h-[45px] bg-white"
          action="default"
        >
          <ButtonText className="text-black flex-1">Ghép chuyến</ButtonText>
          <ChevronRightIcon size={24} color={"#000"} />
        </Button>
      }
    />
  );
};

export default TripRequestAccepted;

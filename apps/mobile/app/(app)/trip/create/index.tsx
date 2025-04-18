import React from "react";
import useLocation from "@/hooks/useLocation";
import TripRequestMapSelectionLayout from "@/src/components/TripRequest/TripRequestMapSelectionLayout";

export default function CreateTripRequestOnly() {
  useLocation({ isWatchLocation: true });

  return <TripRequestMapSelectionLayout />;
}

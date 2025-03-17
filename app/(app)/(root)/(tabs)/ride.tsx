const APP_STRUCT = "RIDE_SCREEN";

import React from "react";
import { Box } from "@/src/components/ui/box";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import CustomerRide from "@/src/components/RideTab/CustomerRider";
import DriverRider from "@/src/components/RideTab/DriverRider";

export default function Ride() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Box className="flex-1 bg-gray-100 py-2">
      {user?.role === "customer" && <CustomerRide />}
      {user?.role === "driver" && <DriverRider />}
    </Box>
  );
}

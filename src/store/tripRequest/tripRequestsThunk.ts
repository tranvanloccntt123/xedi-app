import { xediSupabase } from "@/src/lib/supabase";
import { IDriverTripRequest, IDriverTripRequestStatus } from "@/src/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const acceptDriverTripRequest = createAsyncThunk<
  { tripRequestId: number; driverTripRequest: IDriverTripRequest },
  { tripRequestId: number; driverTripRequestId: number }
>(
  "tripRequest/acceptDriverTripRequest",
  async (
    data: { tripRequestId: number; driverTripRequestId: number },
    { rejectWithValue }
  ) => {
    try {
      const { data: driverTripRequestData, error } =
        await xediSupabase.tables.driverTripRequests.updateById(
          data.driverTripRequestId,
          {
            status: IDriverTripRequestStatus.CUSTOMER_ACCEPT,
          }
        );
      if (error) {
        throw new Error(error.message);
      }
      return {
        tripRequestId: data.tripRequestId,
        driverTripRequest: driverTripRequestData[0],
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

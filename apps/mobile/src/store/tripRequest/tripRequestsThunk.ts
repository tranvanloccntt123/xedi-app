import { xediSupabase } from "supabase-client";
import { IDriverTripRequestStatus } from "@/src/types/enum";
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
        await xediSupabase.tables.fixedRoutes.updateById(
          data.driverTripRequestId,
          {
            status: IDriverTripRequestStatus.CUSTOMER_ACCEPT,
          }
        );
      await xediSupabase.tables.tripRequest.updateById(data.tripRequestId, {
        status: IDriverTripRequestStatus.CUSTOMER_ACCEPT,
      });
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

export const fetchDriverTripRequestAccepted = createAsyncThunk<
  { tripRequestId: number; driverTripRequest?: IDriverTripRequest },
  { tripRequestId: number }
>(
  "tripRequest/fetchDriverTripRequestAccepted",
  async (data: { tripRequestId: number }, { rejectWithValue }) => {
    try {
      const { data: driverTripRequestData, error } =
        await xediSupabase.tables.driverTripRequest.selectRequestOrderAccepted({
          tripRequestId: data.tripRequestId,
        });
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

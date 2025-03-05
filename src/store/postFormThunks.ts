import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { OrsDirections } from "../lib/osrm";
import { InputLocation, SelectLocationType } from "../types";

export const setAndFetchRouteLocation = createAsyncThunk<
  {
    routes?: Route[];
    startLocation?: InputLocation;
    endLocation?: InputLocation;
    inputSelectionType?: SelectLocationType;
  },
  never
>(
  "post/setAndFetchRouteLocation",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { startLocation, endLocation } = state.postForm;

      if (startLocation && endLocation) {
        let res = await OrsDirections.calculate({
          coordinates: [
            [startLocation.lon, startLocation.lat],
            [endLocation.lon, endLocation.lat],
          ],
          profile: "driving-car",
        });
        return {
          routes: res.routes || [],
        };
      } else {
        return rejectWithValue("Location don't allowed");
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

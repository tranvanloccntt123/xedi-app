import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { OrsDirections } from "../../lib/osrm";

export const setAndFetchRouteLocation = createAsyncThunk<
  {
    routes?: Route[];
    startLocation?: InputLocation;
    endLocation?: InputLocation;
    inputSelectionType?: SelectLocationType;
  },
  never
>("post/setAndFetchRouteLocation", async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState() as RootState;
    const { startLocation, endLocation } = state.postForm.tripRequest;

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
});

export const setAndFetchFixedRouteLocation = createAsyncThunk<
  {
    routes?: Route[];
    startLocation?: InputLocation;
    endLocation?: InputLocation;
    inputSelectionType?: SelectLocationType;
  },
  never
>(
  "post/setAndFetchFixedRouteLocation",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { startLocation, endLocation } = state.postForm.fixedRoutes;

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

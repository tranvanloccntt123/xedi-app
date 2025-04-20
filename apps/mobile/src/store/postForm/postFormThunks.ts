import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { OrsDirections } from "../../lib/osrm";

export const setAndFetchRouteLocation = createAsyncThunk<
  {
    routes?: Route[];
    start_location?: InputLocation;
    end_location?: InputLocation;
    inputSelectionType?: SelectLocationType;
  },
  never
>("post/setAndFetchRouteLocation", async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState() as RootState;
    const { start_location, end_location } = state.postForm.tripRequest;

    if (start_location && end_location) {
      let res = await OrsDirections.calculate({
        coordinates: [
          [start_location.lon, start_location.lat],
          [end_location.lon, end_location.lat],
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
    start_location?: InputLocation;
    end_location?: InputLocation;
    inputSelectionType?: SelectLocationType;
  },
  never
>(
  "post/setAndFetchFixedRouteLocation",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { start_location, end_location } = state.postForm.fixedRoutes;

      if (start_location && end_location) {
        let res = await OrsDirections.calculate({
          coordinates: [
            [start_location.lon, start_location.lat],
            [end_location.lon, end_location.lat],
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

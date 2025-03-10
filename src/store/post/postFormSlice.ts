import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  InputLocation,
  IFixedRoute,
  SelectLocationType,
} from "@/src/types";
import { setAndFetchRouteLocation } from "./postFormThunks";

interface ITripRequestTmp {
  startLocation?: InputLocation;
  endLocation?: InputLocation;
  inputSelectionType: SelectLocationType;
  routes: Route[];
  departureTime?: Date;
}

interface IFixedRouteTmp extends ITripRequestTmp {
  totalSeats?: number;
  price?: number;
}

export interface PostFormState {
  content: string;
  fixedRoute: IFixedRouteTmp;
  tripRequest: ITripRequestTmp;
}

const initialState: PostFormState = {
  content: "",
  fixedRoute: {
    inputSelectionType: "start-location",
    routes: [],
  },
  tripRequest: {
    inputSelectionType: "start-location",
    routes: [],
  },
};

const postFormSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    setTripRequestStartLocation: (
      state,
      action: PayloadAction<InputLocation | undefined>
    ) => {
      state.tripRequest.startLocation = action.payload;
    },
    setTripRequestEndLocation: (
      state,
      action: PayloadAction<InputLocation | undefined>
    ) => {
      state.tripRequest.endLocation = action.payload;
    },
    setFixedRoutes: (state, action: PayloadAction<IFixedRoute | undefined>) => {
      // state.fixedRoutes = [...(state.fixedRoutes || []), action.payload];
    },
    setTripRequestDepartureTime: (
      state,
      action: PayloadAction<Date | undefined>
    ) => {
      state.tripRequest.departureTime = action.payload;
    },
    resetPost: (
      _,
      action: PayloadAction<{ inputSelectionType?: SelectLocationType }>
    ) => ({
      ...initialState,
      tripRequest: {
        inputSelectionType: action.payload.inputSelectionType,
        routes: [],
      },
      fixedRoute: {
        inputSelectionType: action.payload.inputSelectionType,
        routes: [],
      },
    }),
    setTripRequestInputSelectionType: (
      state,
      action: PayloadAction<SelectLocationType | undefined>
    ) => {
      state.tripRequest.inputSelectionType = action.payload || "start-location";
    },
    setTripRequestLocation: (state, action: PayloadAction<InputLocation>) => {
      if (!action.payload) return;
      if (state.tripRequest.inputSelectionType === "start-location") {
        state.tripRequest.startLocation = action.payload;
        if (!state.tripRequest.endLocation) {
          state.tripRequest.inputSelectionType = "end-location";
        }
      } else {
        state.tripRequest.endLocation = action.payload;
        if (!state.tripRequest.startLocation) {
          state.tripRequest.inputSelectionType = "start-location";
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setAndFetchRouteLocation.fulfilled, (state, action) => {
      if (action.payload.routes)
        state.tripRequest.routes = action.payload.routes || [];
      if (action.payload.inputSelectionType)
        state.tripRequest.inputSelectionType =
          action.payload.inputSelectionType;
      if (action.payload.startLocation)
        state.tripRequest.startLocation = action.payload.startLocation;
      if (action.payload.endLocation)
        state.tripRequest.endLocation = action.payload.endLocation;
    });
  },
});

export const {
  setContent,
  setTripRequestStartLocation,
  setTripRequestEndLocation,
  setFixedRoutes,
  resetPost,
  setTripRequestDepartureTime,
  setTripRequestInputSelectionType,
  setTripRequestLocation,
} = postFormSlice.actions;

export default postFormSlice.reducer;

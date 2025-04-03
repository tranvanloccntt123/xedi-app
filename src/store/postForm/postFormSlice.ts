import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  setAndFetchFixedRouteLocation,
  setAndFetchRouteLocation,
} from "./postFormThunks";

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
  fixedRoutes: IFixedRouteTmp;
  tripRequest: ITripRequestTmp;
  images: string[];
}

const initialState: PostFormState = {
  content: "",
  fixedRoutes: {
    inputSelectionType: "start-location",
    routes: [],
  },
  tripRequest: {
    inputSelectionType: "start-location",
    routes: [],
  },
  images: [],
};

const postFormSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    setFixedRoutes: (state, action: PayloadAction<IFixedRoute | undefined>) => {
      // state.fixedRoutes = [...(state.fixedRoutes || []), action.payload];
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

    //Fixed Route

    setFixedRouteStartLocation: (
      state,
      action: PayloadAction<InputLocation | undefined>
    ) => {
      state.fixedRoutes.startLocation = action.payload;
    },
    setFixedRouteEndLocation: (
      state,
      action: PayloadAction<InputLocation | undefined>
    ) => {
      state.fixedRoutes.endLocation = action.payload;
    },
    setFixedRouteDepartureTime: (
      state,
      action: PayloadAction<Date | undefined>
    ) => {
      state.fixedRoutes.departureTime = action.payload;
    },
    setFixedRouteInputSelectionType: (
      state,
      action: PayloadAction<SelectLocationType | undefined>
    ) => {
      state.fixedRoutes.inputSelectionType = action.payload || "start-location";
    },
    setFixedRouteLocation: (state, action: PayloadAction<InputLocation>) => {
      if (!action.payload) return;
      if (state.fixedRoutes.inputSelectionType === "start-location") {
        state.fixedRoutes.startLocation = action.payload;
        if (!state.fixedRoutes.endLocation) {
          state.fixedRoutes.inputSelectionType = "end-location";
        }
      } else {
        state.fixedRoutes.endLocation = action.payload;
        if (!state.fixedRoutes.startLocation) {
          state.fixedRoutes.inputSelectionType = "start-location";
        }
      }
    },
    setFixedRouteTotalSeat: (state, action: PayloadAction<number>) => {
      state.fixedRoutes.totalSeats = action.payload;
    },
    setFixedRoutePrice: (state, action: PayloadAction<number>) => {
      state.fixedRoutes.price = action.payload;
    },
    addImage: (state, action: PayloadAction<string>) => {
      const data = state.images.concat();
      data.push(action.payload);
      state.images = data;
    },
    removeImage: (state, action: PayloadAction<number>) => {
      const data = state.images.concat();
      data.splice(action.payload, 1);
      state.images = data;
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
    builder.addCase(
      setAndFetchFixedRouteLocation.fulfilled,
      (state, action) => {
        if (action.payload.routes)
          state.fixedRoutes.routes = action.payload.routes || [];
        if (action.payload.inputSelectionType)
          state.fixedRoutes.inputSelectionType =
            action.payload.inputSelectionType;
        if (action.payload.startLocation)
          state.fixedRoutes.startLocation = action.payload.startLocation;
        if (action.payload.endLocation)
          state.fixedRoutes.endLocation = action.payload.endLocation;
      }
    );
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
  setFixedRouteDepartureTime,
  setFixedRouteEndLocation,
  setFixedRouteInputSelectionType,
  setFixedRouteLocation,
  setFixedRoutePrice,
  setFixedRouteStartLocation,
  setFixedRouteTotalSeat,
} = postFormSlice.actions;

export default postFormSlice.reducer;

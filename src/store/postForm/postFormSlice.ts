import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  setAndFetchFixedRouteLocation,
  setAndFetchRouteLocation,
} from "./postFormThunks";

interface ITripRequestTmp {
  start_location?: InputLocation;
  end_location?: InputLocation;
  inputSelectionType: SelectLocationType;
  routes: Route[];
  departure_time?: Date;
}

interface IFixedRouteTmp extends ITripRequestTmp {
  total_seats?: number;
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
      state.tripRequest.start_location = action.payload;
    },
    setTripRequestEndLocation: (
      state,
      action: PayloadAction<InputLocation | undefined>
    ) => {
      state.tripRequest.end_location = action.payload;
    },
    setTripRequestDepartureTime: (
      state,
      action: PayloadAction<Date | undefined>
    ) => {
      state.tripRequest.departure_time = action.payload;
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
    resetPostWithStartLocation: (_, action: PayloadAction<InputLocation>) => ({
      ...initialState,
      tripRequest: {
        inputSelectionType: "end-location",
        routes: [],
        start_location: action.payload,
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
        state.tripRequest.start_location = action.payload;
        if (!state.tripRequest.end_location) {
          state.tripRequest.inputSelectionType = "end-location";
        }
      } else {
        state.tripRequest.end_location = action.payload;
        if (!state.tripRequest.start_location) {
          state.tripRequest.inputSelectionType = "start-location";
        }
      }
    },

    //Fixed Route

    setFixedRouteStartLocation: (
      state,
      action: PayloadAction<InputLocation | undefined>
    ) => {
      state.fixedRoutes.start_location = action.payload;
    },
    setFixedRouteEndLocation: (
      state,
      action: PayloadAction<InputLocation | undefined>
    ) => {
      state.fixedRoutes.end_location = action.payload;
    },
    setFixedRouteDepartureTime: (
      state,
      action: PayloadAction<Date | undefined>
    ) => {
      state.fixedRoutes.departure_time = action.payload;
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
        state.fixedRoutes.start_location = action.payload;
        if (!state.fixedRoutes.end_location) {
          state.fixedRoutes.inputSelectionType = "end-location";
        }
      } else {
        state.fixedRoutes.end_location = action.payload;
        if (!state.fixedRoutes.start_location) {
          state.fixedRoutes.inputSelectionType = "start-location";
        }
      }
    },
    setFixedRouteTotalSeat: (state, action: PayloadAction<number>) => {
      state.fixedRoutes.total_seats = action.payload;
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
      if (action.payload.start_location)
        state.tripRequest.start_location = action.payload.start_location;
      if (action.payload.end_location)
        state.tripRequest.end_location = action.payload.end_location;
    });
    builder.addCase(
      setAndFetchFixedRouteLocation.fulfilled,
      (state, action) => {
        if (action.payload.routes)
          state.fixedRoutes.routes = action.payload.routes || [];
        if (action.payload.inputSelectionType)
          state.fixedRoutes.inputSelectionType =
            action.payload.inputSelectionType;
        if (action.payload.start_location)
          state.fixedRoutes.start_location = action.payload.start_location;
        if (action.payload.end_location)
          state.fixedRoutes.end_location = action.payload.end_location;
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
  resetPostWithStartLocation,
  addImage,
  removeImage,
} = postFormSlice.actions;

export default postFormSlice.reducer;

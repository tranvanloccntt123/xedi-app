import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  InputLocation,
  IFixedRoute,
  SelectLocationType,
} from "@/src/types";
import { setAndFetchRouteLocation } from "./postFormThunks";

export interface PostFormState {
  content: string;
  startLocation?: InputLocation;
  endLocation?: InputLocation;
  fixedRoutes?: IFixedRoute[];
  departureTime?: Date;
  inputSelectionType: SelectLocationType;
  routes: Route[];
}

const initialState: PostFormState = {
  content: "",
  startLocation: undefined,
  endLocation: undefined,
  fixedRoutes: undefined,
  departureTime: undefined,
  inputSelectionType: "start-location",
  routes: [],
};

const postFormSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    setStartLocation: (
      state,
      action: PayloadAction<InputLocation | undefined>
    ) => {
      state.startLocation = action.payload;
    },
    setEndLocation: (
      state,
      action: PayloadAction<InputLocation | undefined>
    ) => {
      state.endLocation = action.payload;
    },
    setFixedRoutes: (state, action: PayloadAction<IFixedRoute | undefined>) => {
      state.fixedRoutes = [...(state.fixedRoutes || []), action.payload];
    },
    setDepartureTime: (state, action: PayloadAction<Date | undefined>) => {
      state.departureTime = action.payload;
    },
    resetPost: (
      _,
      action: PayloadAction<{ inputSelectionType?: SelectLocationType }>
    ) => ({ ...initialState, routes: [], ...action.payload }),
    setInputSelectionType: (
      state,
      action: PayloadAction<SelectLocationType | undefined>
    ) => {
      state.inputSelectionType = action.payload || "start-location";
    },
    setLocation: (state, action: PayloadAction<InputLocation>) => {
      if (!action.payload) return;
      if (state.inputSelectionType === "start-location") {
        state.startLocation = action.payload;
        if (!state.endLocation) {
          state.inputSelectionType = "end-location";
        }
      } else {
        state.endLocation = action.payload;
        if (!state.startLocation) {
          state.inputSelectionType = "start-location";
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setAndFetchRouteLocation.fulfilled, (state, action) => {
      if (action.payload.routes) state.routes = action.payload.routes || [];
      if (action.payload.inputSelectionType)
        state.inputSelectionType = action.payload.inputSelectionType;
      if (action.payload.startLocation)
        state.startLocation = action.payload.startLocation;
      if (action.payload.endLocation)
        state.endLocation = action.payload.endLocation;
    });
  },
});

export const {
  setContent,
  setStartLocation,
  setEndLocation,
  setFixedRoutes,
  resetPost,
  setDepartureTime,
  setInputSelectionType,
  setLocation,
} = postFormSlice.actions;

export default postFormSlice.reducer;

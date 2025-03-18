import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export enum XEDI_GROUP_INFO {
  FEED = "feed",
  TRIP_REQUEST = "trip_request",
}

export interface FetchState {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  data?: any;
}

export interface FetchServicesState {
  requests: Record<string, FetchState>;
}

const initialState: FetchServicesState = {
  requests: {},
};

const fetchServicesSlice = createSlice({
  name: "fetchServices",
  initialState,
  reducers: {
    startFetching(state, action: PayloadAction<string>) {
      if (!state.requests[action.payload]) {
        state.requests[action.payload] = {
          isLoading: true,
          isError: false,
          errorMessage: "",
        };
      } else {
        state.requests[action.payload] = {
          ...state.requests[action.payload],
          isError: false,
          isLoading: true,
          errorMessage: "",
        };
      }
    },
    endFetchingSuccess(
      state,
      action: PayloadAction<{ key: string; data: any }>
    ) {
      state.requests[action.payload.key] = {
        ...state.requests[action.payload.key],
        data: action.payload.data,
        isLoading: false,
      };
    },
    endFetchingError(
      state,
      action: PayloadAction<{ key: string; errorMessage: string }>
    ) {
      state.requests[action.payload.key] = {
        ...state.requests[action.payload.key],
        errorMessage: action.payload.errorMessage ?? "",
        isError: true,
        isLoading: false,
      };
    },
    pushFetchingInfo(
      state,
      action: PayloadAction<{ groupKey: string; data: any[] }>
    ) {
      action.payload.data.forEach((row) => {
        const key = `${action.payload.groupKey}_${row.id}`;
        if (state.requests[key]) {
          state.requests[key] = { ...state.requests[key], data: row };
        } else {
          state.requests[key] = {
            isError: false,
            isLoading: false,
            errorMessage: "",
            data: row,
          };
        }
      });
    },
  },
  extraReducers: (builder) => {},
});

export const {
  startFetching,
  endFetchingError,
  endFetchingSuccess,
  pushFetchingInfo,
} = fetchServicesSlice.actions;
export default fetchServicesSlice.reducer;

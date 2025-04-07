import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchDetailInfo } from "./fetchServicesThunk";

export enum XEDI_QUERY_KEY {
  FEED = "feed",
  TRIP_REQUEST = "trip_request",
  FIXED_ROUTE = "fixed_route",
  DRIVER_TRIP_REQUEST = "driver_trip_request",
  CUSTOMER_LIST = "customer_list",
  YOUR_LOCATIONS_STORED = "your_locations_store",
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
    setFetchingData(state, action: PayloadAction<{ key: string; data: any }>) {
      if (state.requests[action.payload.key]) {
        state.requests[action.payload.key].data = action.payload.data;
      } else {
        state.requests[action.payload.key] = {
          isLoading: false,
          isError: false,
          errorMessage: "",
          data: action.payload.data,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetailInfo.pending, (state, action) => {
        const key = action.meta.arg.key;
        if (key) {
          if (!state.requests[key]) {
            state.requests[key] = {
              isLoading: true,
              isError: false,
              errorMessage: "",
            };
          } else {
            state.requests[key] = {
              ...state.requests[key],
              isError: false,
              isLoading: true,
              errorMessage: "",
            };
          }
        }
      })
      .addCase(fetchDetailInfo.fulfilled, (state, action) => {
        const key = action.payload.key;
        if (key) {
          if (!state.requests[key]) {
            state.requests[key] = {
              isLoading: false,
              isError: false,
              errorMessage: "",
              data: action.payload.data,
            };
          } else {
            state.requests[key] = {
              ...state.requests[key],
              data: action.payload.data,
              isError: false,
              isLoading: false,
              errorMessage: "",
            };
          }
        }
      })
      .addCase(fetchDetailInfo.rejected, (state, action) => {
        const key = action.meta.arg.key;
        if (key) {
          if (!state.requests[key]) {
            state.requests[key] = {
              isLoading: false,
              isError: true,
              errorMessage: "",
              data: undefined,
            };
          } else {
            state.requests[key] = {
              ...state.requests[key],
              isError: true,
              isLoading: false,
              errorMessage: "",
              data: undefined,
            };
          }
        }
      });
  },
});

export const {
  startFetching,
  endFetchingError,
  endFetchingSuccess,
  pushFetchingInfo,
  setFetchingData,
} = fetchServicesSlice.actions;
export default fetchServicesSlice.reducer;

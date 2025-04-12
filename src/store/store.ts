import { configureStore } from "@reduxjs/toolkit";
import { combineReducers, type AnyAction } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import authReducer, { AuthState } from "./auth/authSlice";
import userReducer from "./user/userSlice";
import fixedRoutesReducer, {
  FixedRoutesState,
} from "./fixedRoute/fixedRoutesSlice";
import tripRequestsReducer, {
  TripRequestsState,
} from "./tripRequest/tripRequestsSlice";
import feedReducer, { FeedState } from "./feed/feedSlice";
import fetchServices, {
  FetchServicesState,
} from "./fetchServices/fetchServicesSlice";
import postFormReducer, { PostFormState } from "./postForm/postFormSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import locationReducer, { LocationState } from "./location/locationSlice";
import markImageReducer, {
  MarkImageSliceState,
} from "./markImage/markImageSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "user"],
};

const combinedReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  fixedRoutes: fixedRoutesReducer,
  tripRequests: tripRequestsReducer,
  feed: feedReducer,
  postForm: postFormReducer,
  location: locationReducer,
  fetchServices: fetchServices,
  markImage: markImageReducer,
});

const rootReducer = (state: RootState | undefined, action: AnyAction) => {
  if (action.type === "auth/logout") {
    // Reset all reducers to their initial state
    state = undefined;
  }
  return combinedReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const reduxPersistActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: reduxPersistActions,
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = {
  auth: AuthState;
  user: UserState;
  fixedRoutes: FixedRoutesState;
  tripRequests: TripRequestsState;
  feed: FeedState;
  postForm: PostFormState;
  location: LocationState;
  fetchServices: FetchServicesState;
  markImage: MarkImageSliceState;
};
export type AppDispatch = typeof store.dispatch;

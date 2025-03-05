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

import authReducer, { AuthState } from "./authSlice";
import userReducer from "./userSlice";
import fixedRoutesReducer, { FixedRoutesState } from "./fixedRoutesSlice";
import tripRequestsReducer, { TripRequestsState } from "./tripRequestsSlice";
import feedReducer, { FeedState } from "./feedSlice";
import postFormReducer, { PostFormState } from "./postFormSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserState } from "../types";
import locationReducer, { LocationState } from "./locationSlice";

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
};
export type AppDispatch = typeof store.dispatch;

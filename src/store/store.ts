import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './authSlice';
import userReducer from './userSlice';
import fixedRoutesReducer from './fixedRoutesSlice';
import tripRequestsReducer from './tripRequestsSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user', 'fixedRoutes', 'tripRequests']
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  fixedRoutes: fixedRoutesReducer,
  tripRequests: tripRequestsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


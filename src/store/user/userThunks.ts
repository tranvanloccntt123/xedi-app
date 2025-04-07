import { createAsyncThunk } from "@reduxjs/toolkit";
import { xediSupabase } from "@/src/lib/supabase";

export const fetchMyUserInfo = createAsyncThunk<IUser, void>(
  "user/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await xediSupabase.tables.users.info();
      if (response.error) {
        throw new Error(response.error.message);
      }
      if (response.data && response.data.length > 0) {
        return response.data[0] as IUser;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUserCoins = createAsyncThunk<IUserCoin, void>(
  "user/fetchUserCoins",
  async (_, { rejectWithValue }) => {
    try {
      const response = await xediSupabase.tables.userCoins.getCoins();
      if (response.error) {
        throw new Error(response.error.message);
      }
      if (response.data) {
        return response.data as IUserCoin;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const sendUserLocation = createAsyncThunk<
  { lat: number; lon: number },
  { lat: number; lon: number }
>(
  "user/fetchUserCoins",
  async (data: { lat: number; lon: number }, { rejectWithValue }) => {
    try {
      const { data: dataUpdated, error } =
        await xediSupabase.tables.users.updateLocation(data.lat, data.lon);
      if (error) {
        throw new Error(error.message);
      }
      if (dataUpdated?.[0]) {
        return dataUpdated[0] as { lat: number; lon: number };
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateUserInfo = createAsyncThunk<IUser, Partial<IUser>>(
  "user/updateUserInfo",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await xediSupabase.tables.users.updateUser(
        userData.id,
        userData as IUser
      );
      if (response.error) {
        throw new Error(response.error.message);
      }
      if (response.data && response.data.length > 0) {
        return response.data[0] as IUser;
      } else {
        throw new Error("User update failed");
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

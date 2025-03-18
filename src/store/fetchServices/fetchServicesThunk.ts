import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDetailInfo = createAsyncThunk(
  "fetchServices/fetchDetailInfo",
  async (params: { key: string; fetch: () => any }, { rejectWithValue }) => {
    try {
      const data = await params.fetch();
      return {
        data,
        key: params.key,
      };
    } catch (e) {
      rejectWithValue(e);
    }
  }
);

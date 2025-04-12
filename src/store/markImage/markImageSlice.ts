import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface MarkImageSliceState {
  image: string;
}

const initialState: MarkImageSliceState = {
  image: "",
};

const markImageSlice = createSlice({
  name: "markImage",
  initialState,
  reducers: {
    setImage(state, action: PayloadAction<string>) {
      state.image = action.payload;
    },
  },
});

export const { setImage } = markImageSlice.actions;

export default markImageSlice.reducer;

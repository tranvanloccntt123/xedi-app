import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export enum MarkImageType {
  AVATAR,
  POST,
}

export interface MarkImageSliceState {
  image: string;
  type: MarkImageType;
}

const initialState: MarkImageSliceState = {
  image: "",
  type: MarkImageType.POST,
};

const markImageSlice = createSlice({
  name: "markImage",
  initialState,
  reducers: {
    setImage(state, action: PayloadAction<string>) {
      state.image = action.payload;
    },
    setMarkImageType(state, action: PayloadAction<MarkImageType>) {
      state.type = action.payload || MarkImageType.POST;
    },
  },
});

export const { setImage, setMarkImageType } = markImageSlice.actions;

export default markImageSlice.reducer;

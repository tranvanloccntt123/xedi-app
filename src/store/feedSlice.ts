import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { INewsFeedItem } from "@/src/types";

export interface FeedState {
  items: INewsFeedItem[];
  currentNewsFeedItem: INewsFeedItem | null;
  deletedItems: string[]; // New state to store deleted item IDs
}

const initialState: FeedState = {
  items: [],
  currentNewsFeedItem: null,
  deletedItems: [], // Initialize as an empty array
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setFeedItems: (state, action: PayloadAction<INewsFeedItem[]>) => {
      state.items = action.payload;
    },
    addFeedItem: (state, action: PayloadAction<INewsFeedItem>) => {
      state.items.push(action.payload);
    },
    updateFeedItem: (state, action: PayloadAction<INewsFeedItem>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteFeedItem: (state, action: PayloadAction<string>) => {
      state.deletedItems.push(action.payload); // Mark the item as deleted
      // We'll keep the item in the items array for animation purposes
    },
    clearFeedItems: (state) => {
      state.items = process.env.NODE_ENV === "development" ? state.items : [];
      state.deletedItems = [];
    },
    setCurrentNewsFeedItem: (
      state,
      action: PayloadAction<INewsFeedItem | null>
    ) => {
      state.currentNewsFeedItem = action.payload;
    },
  },
});

export const {
  setFeedItems,
  addFeedItem,
  updateFeedItem,
  deleteFeedItem,
  clearFeedItems,
  setCurrentNewsFeedItem,
} = feedSlice.actions;
export default feedSlice.reducer;

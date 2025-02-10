import React from "react";

import {
  BottomSheetPortal,
  BottomSheetDragIndicator,
  BottomSheetContent,
  BottomSheetItem,
  BottomSheetItemText,
  BottomSheetBackdrop,
} from "@/src/components/ui/bottom-sheet";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import type { INewsFeedItem, IUser } from "../types";
import { Box } from "./ui/box";
import { Text } from "./ui/text";
import { xediSupabase } from "../lib/supabase";
import { deleteFeedItem } from "../store/feedSlice";

const FeedBottomSheet: React.FC<object> = () => {
  const dispatch = useDispatch();
  const { currentNewsFeedItem, user } = useSelector(
    (
      state: RootState
    ): {
      user: IUser | null;
      currentNewsFeedItem: INewsFeedItem | null;
    } => ({
      currentNewsFeedItem: state.feed.currentNewsFeedItem,
      user: state.user.currentUser,
    })
  );

  const isAuthor = React.useMemo(
    () =>
      user && currentNewsFeedItem && user.id === currentNewsFeedItem.users.id,
    [user, currentNewsFeedItem]
  );

  const deleteNewFeed = async () => {
    if (currentNewsFeedItem) {
      await xediSupabase.tables.fixedRoutes.deleteByField(
        "feed_id",
        currentNewsFeedItem.id
      );
      await xediSupabase.tables.feed.deleteById(currentNewsFeedItem.id);
      dispatch(deleteFeedItem(currentNewsFeedItem.id));
    }
  };

  return (
    <BottomSheetPortal
      snapPoints={["18%"]}
      backdropComponent={BottomSheetBackdrop}
      handleComponent={BottomSheetDragIndicator}
    >
      <BottomSheetContent style={{ justifyContent: "flex-end" }}>
        <BottomSheetItem>
          <BottomSheetItemText>Lưu thông tin</BottomSheetItemText>
        </BottomSheetItem>
        <BottomSheetItem>
          <BottomSheetItemText>Báo cáo bài đăng</BottomSheetItemText>
        </BottomSheetItem>
        {isAuthor && (
          <BottomSheetItem onPress={deleteNewFeed}>
            <Text className="text-error-300">Xoá bài đăng</Text>
          </BottomSheetItem>
        )}
      </BottomSheetContent>
    </BottomSheetPortal>
  );
};

export default FeedBottomSheet;

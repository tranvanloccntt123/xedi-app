import React from "react";

import {
  BottomSheetPortal,
  BottomSheetDragIndicator,
  BottomSheetContent,
  BottomSheetItem,
  BottomSheetItemText,
  BottomSheetBackdrop,
} from "@/src/components/ui/bottom-sheet";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { INewsFeedItem, IUser } from "../types";
import { Box } from "./ui/box";
import { Text } from "./ui/text";
import { xediSupabase } from "../lib/supabase";

const FeedBottomSheet: React.FC<object> = () => {
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
    await xediSupabase.tables.feed.deleteById(currentNewsFeedItem.id);
  };

  return (
    <BottomSheetPortal
      snapPoints={["25%"]}
      backdropComponent={BottomSheetBackdrop}
      handleComponent={BottomSheetDragIndicator}
    >
      <BottomSheetContent style={{ flex: 1 }}>
        <Box className="flex-1">
          <BottomSheetItem>
            <BottomSheetItemText>Lưu thông tin</BottomSheetItemText>
          </BottomSheetItem>
          <BottomSheetItem>
            <BottomSheetItemText>Báo cáo bài đăng</BottomSheetItemText>
          </BottomSheetItem>
        </Box>
        {isAuthor && (
          <BottomSheetItem onPress={() => deleteNewFeed()}>
            <Text className="text-error-300">Xoá bài đăng</Text>
          </BottomSheetItem>
        )}
      </BottomSheetContent>
    </BottomSheetPortal>
  );
};

export default FeedBottomSheet;

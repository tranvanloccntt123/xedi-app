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
import { RootState } from "../store/store";
import { IFixedRoute, IUser } from "../types";

const FeedBottomSheet: React.FC<object> = () => {
  const { currentFixedRoute, user } = useSelector(
    (
      state: RootState
    ): {
      user: IUser | null;
      currentFixedRoute: IFixedRoute | null;
    } => ({
      currentFixedRoute: state.fixedRoutes.currentFixedRoute,
      user: state.user.currentUser,
    })
  );

  const isAuthor = React.useMemo(
    () => user && currentFixedRoute && user.id === currentFixedRoute.user_id,
    [user, currentFixedRoute]
  );
  return (
    <BottomSheetPortal
      snapPoints={["25%", "50%"]}
      backdropComponent={BottomSheetBackdrop}
      handleComponent={BottomSheetDragIndicator}
    >
      <BottomSheetContent>
        <BottomSheetItem>
          <BottomSheetItemText>Item 1</BottomSheetItemText>
        </BottomSheetItem>
        <BottomSheetItem>
          <BottomSheetItemText>Item 2</BottomSheetItemText>
        </BottomSheetItem>
        <BottomSheetItem>
          <BottomSheetItemText>Item 3</BottomSheetItemText>
        </BottomSheetItem>
      </BottomSheetContent>
    </BottomSheetPortal>
  );
};

export default FeedBottomSheet;

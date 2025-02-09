import React from "react";

import {
  BottomSheetPortal,
  BottomSheetDragIndicator,
  BottomSheetContent,
  BottomSheetItem,
  BottomSheetItemText,
  BottomSheetBackdrop,
} from "@/src/components/ui/bottom-sheet";

const FeedBottomSheet: React.FC<object> = () => {
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

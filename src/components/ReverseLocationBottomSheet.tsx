import React from "react";

import {
  BottomSheetPortal,
  BottomSheetDragIndicator,
  BottomSheetContent,
  BottomSheetItem,
  BottomSheetItemText,
  BottomSheetBackdrop,
} from "@/src/components/ui/bottom-sheet";
import useDebounce from "@/hooks/useDebounce";
import axios from "axios";

const ReverseLocationBottomSheet: React.FC<{
  coordinate?: {
    lat: number;
    lon: number;
  };
}> = ({ coordinate }) => {
  const debounce = useDebounce({ time: 100 });

  React.useEffect(() => {
    debounce(async () => {
      if (coordinate && coordinate.lat && coordinate.lon) {
        // setIsLoading(true);
        try {
          const response = await axios.get(
            `https://photon.komoot.io/reverse?lat=${coordinate.lat}&lon=${coordinate.lon}`,
            {
              headers: {
                "access-control-allow-origin": "*",
              },
              timeout: 30000,
            }
          );
          console.log(response);
          //   setResults(data);
        } catch (error) {
          console.error("Error fetching locations:", error);
        } finally {
          //   setIsLoading(false);
        }
      } else {
        // setResults([]);
      }
    });
  }, [coordinate]);

  return (
    <BottomSheetPortal
      snapPoints={["80%"]}
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
      </BottomSheetContent>
    </BottomSheetPortal>
  );
};

export default ReverseLocationBottomSheet;

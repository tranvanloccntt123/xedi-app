import React from "react";
import { Box } from "@/src/components/ui/box";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/src/components/Header";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { Button, ButtonText } from "@/src/components/ui/button";

export default function CreateFixedRoute() {
  const fixedRouteTmp = useSelector(
    (state: RootState) => state.postForm.fixedRoutes
  );
  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        <Box className="px-4">
          <Header
            title="Bắt đầu hành trình mới"
            subTitle="Chúc bạn có một hành trình an toàn!"
          />
        </Box>
        <Box className="flex-1">
          <Button onPress={() => {}}>
            <ButtonText>
              {fixedRouteTmp?.startLocation.display_name || "Điểm khởi hành"}
            </ButtonText>
          </Button>
        </Box>
      </SafeAreaView>
    </Box>
  );
}

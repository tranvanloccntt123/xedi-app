import React from "react";
import { Box } from "@/src/components/ui/box";
import PagerView from "react-native-pager-view";
import { HStack } from "../ui/hstack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import TripRequestHistory from "./TripRequestHistory";
import FixedRouteHistory from "./FixedRouteHistory";

const HEAD_ROUNDED = 100;

const HEADER_BG_COLOR = {
  active: "rgba(52, 170, 246, 1)",
  inActive: "rgba(52, 170, 246, 0)",
};

const HEADER_TXT_COLOR = {
  active: "#fff",
  inActive: "#000",
};
const DriverRider: React.FC<object> = () => {
  const pagerRef = React.useRef<PagerView>(null);
  const headerBtnAnim = useSharedValue(0);
  const requestBtnStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        headerBtnAnim.value,
        [0, 1],
        [HEADER_BG_COLOR.active, HEADER_BG_COLOR.inActive]
      ),
    };
  });

  const requestTxtStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        headerBtnAnim.value,
        [0, 1],
        [HEADER_TXT_COLOR.active, HEADER_TXT_COLOR.inActive]
      ),
    };
  });

  const fixedRouteBtnStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        headerBtnAnim.value,
        [0, 1],
        [HEADER_BG_COLOR.inActive, HEADER_BG_COLOR.active]
      ),
    };
  });

  const fixedRouteTxtStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        headerBtnAnim.value,
        [0, 1],
        [HEADER_TXT_COLOR.inActive, HEADER_TXT_COLOR.active]
      ),
    };
  });
  return (
    <Box className="flex-1">
      <SafeAreaView style={{ flex: 1 }}>
        <HStack
          className="justify-center items-center self-center bg-gray-200"
          style={styles.headerContainer}
        >
          <Pressable
            onPress={() => {
              headerBtnAnim.value = 0;
              pagerRef.current?.setPage(0);
            }}
          >
            <Animated.View style={[styles.headerBtn, requestBtnStyle]}>
              <Animated.Text style={[styles.headerBtnTxt, requestTxtStyle]}>
                Yêu cầu
              </Animated.Text>
            </Animated.View>
          </Pressable>
          <Pressable
            onPress={() => {
              headerBtnAnim.value = 1;
              pagerRef.current?.setPage(1);
            }}
          >
            <Animated.View style={[styles.headerBtn, fixedRouteBtnStyle]}>
              <Animated.Text style={[styles.headerBtnTxt, fixedRouteTxtStyle]}>
                Chuyến đi
              </Animated.Text>
            </Animated.View>
          </Pressable>
        </HStack>
        <PagerView
          scrollEnabled={false}
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
        >
          <View style={{ flex: 1 }} key={0}>
            <TripRequestHistory />
          </View>
          <View style={{ flex: 1 }} key={0}>
            <FixedRouteHistory />
          </View>
        </PagerView>
      </SafeAreaView>
    </Box>
  );
};

export default DriverRider;

const styles = StyleSheet.create({
  headerContainer: {
    borderRadius: HEAD_ROUNDED,
  },
  headerBtn: {
    paddingVertical: 8,
    borderRadius: HEAD_ROUNDED,
    width: 130,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBtnTxt: {
    fontSize: 13,
  },
});

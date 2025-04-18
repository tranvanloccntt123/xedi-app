import React from "react";
import { Animated, StyleSheet } from "react-native";
import PinIcon from "./icons/PinIcon";
import { Box } from "./ui/box";

const PinMarkerIcon: React.FC<object> = () => {
  return (
    <Animated.View style={[styles.pinContainer]}>
      <Box style={{ top: -18 }}>
        <PinIcon size={34} color="#000000" />
      </Box>
    </Animated.View>
  );
};

export default PinMarkerIcon;

const styles = StyleSheet.create({
  pinContainer: {
    position: "absolute",
  },
});

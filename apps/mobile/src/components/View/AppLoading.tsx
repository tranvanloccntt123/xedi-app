import React from "react";
import { Box } from "@/src/components/ui/box";
import { Image, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import Lottie from "@/src/lottie";
import AppColors from "@/src/constants/colors";

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
});

const AppLoading: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
}> = ({ isLoading, children }) => {
  return isLoading ? (
    <Box className="flex-1 justify-center items-center">
      <Box className="w-[300px] h-[300px]">
        <LottieView
          source={Lottie.FIND_LOCATION}
          style={{ width: "100%", height: "100%" }}
          autoPlay
          loop
        />
      </Box>
    </Box>
  ) : (
    children
  );
};

export default AppLoading;

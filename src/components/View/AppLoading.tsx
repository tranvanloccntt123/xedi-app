import React from "react";
import { Box } from "@/src/components/ui/box";
import { Image, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import Lottie from "@/src/lottie";

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
      <Box className="w-[200px] h-[200px]">
        <LottieView
          source={Lottie.FIND_LOCATION}
          colorFilters={[]}
          style={{ width: "100%", height: "100%" }}
          autoPlay
          loop
        />
      </Box>
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
      />
    </Box>
  ) : (
    children
  );
};

export default AppLoading;

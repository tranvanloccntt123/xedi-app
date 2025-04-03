import AppImages from "@/assets/images";
import React from "react";
import { Image, StyleProp, ViewStyle } from "react-native";
import { scale } from "react-native-size-matters";
import { Box } from "./ui/box";

type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const logoSize: Record<LogoSize, number> = {
  xs: scale(20),
  sm: scale(50),
  md: scale(80),
  lg: scale(100),
  xl: scale(120),
};

const Logo: React.FC<{
  size: LogoSize;
  className?: string;
  style?: StyleProp<ViewStyle>;
}> = ({ size, className, style }) => {
  return (
    <Box className={className} style={style}>
      <Image
        source={AppImages.LOGO}
        style={{
          width: logoSize[size],
          height: logoSize[size],
          resizeMode: "contain",
        }}
      />
    </Box>
  );
};

export default Logo;

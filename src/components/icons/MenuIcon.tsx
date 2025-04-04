import React from "react";
import { Svg, Path } from "react-native-svg";

const MenuIcon: React.FC<{ color: string; size: number }> = ({
  color,
  size,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 6H20M4 12H20M4 18H20"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default MenuIcon;

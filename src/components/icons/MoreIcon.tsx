import React from "react";
import { Svg, Rect, Circle } from "react-native-svg";

const MoreIcon: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => {
  return (
    <Svg fill={color} width={size} height={size} viewBox="-3.5 0 24 24">
      <Rect width="24" height="24" fill="white" />
      <Circle
        cx="12"
        cy="7"
        r="0.5"
        transform="rotate(90 12 7)"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Circle
        cx="12"
        cy="12"
        r="0.5"
        transform="rotate(90 12 12)"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Circle
        cx="12"
        cy="17"
        r="0.5"
        transform="rotate(90 12 17)"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default MoreIcon;

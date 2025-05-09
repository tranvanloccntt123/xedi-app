import React from "react";
import { Ellipse, Svg } from "react-native-svg";

const EclipseIcon: React.FC<{
  size: number;
  color: string;
}> = ({ size, color }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Sun */}
      {/* <Circle cx="50" cy="50" r="40" fill={color} /> */}
      {/* Moon */}
      <Ellipse cx="50" cy="50" ry="15" rx="40" fill={color} />
    </Svg>
  );
};

export default EclipseIcon;

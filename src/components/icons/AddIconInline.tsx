import React from "react";
import { Path, Svg } from "react-native-svg";

const AddIconInLine: React.FC<{
  size: number;
  color: string;
}> = ({ color, size }) => {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <Path
        fill={color}
        d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"
      />
    </Svg>
  );
};

export default AddIconInLine;

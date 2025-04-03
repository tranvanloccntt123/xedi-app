import React from "react";
import { Svg, G, Path } from "react-native-svg";

const PinsFullfield: React.FC<{ color: string; size: number | string }> = ({
  color,
  size,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G>
        <Path fill="none" d="M0 0h24v24H0z" />
        <Path
          d="M18.364 17.364L12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0zM12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
          fill={color}
        />
      </G>
    </Svg>
  );
};

export default PinsFullfield;

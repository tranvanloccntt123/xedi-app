import React from "react";
import { Path, Svg, G } from "react-native-svg";

const SwapIcon: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G>
        <G>
          <Path
            d="M6.97913 4.60132V17.2193"
            stroke={color}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path
            d="M2.90002 8.7001C2.90002 8.7001 5.06902 4.6001 6.97802 4.6001C8.88602 4.6001 11.056 8.7001 11.056 8.7001"
            stroke={color}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path
            d="M16.9059 19.4276V6.80957"
            stroke={color}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path
            d="M20.985 15.3286C20.985 15.3286 18.815 19.4286 16.907 19.4286C14.999 19.4286 12.829 15.3286 12.829 15.3286"
            stroke={color}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </G>
      </G>
    </Svg>
  );
};

export default SwapIcon;

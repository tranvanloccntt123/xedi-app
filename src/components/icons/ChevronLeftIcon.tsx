import React from "react";
import { Path, Svg } from "react-native-svg";

const ChevronLeftIcon: React.FC<{
  size: number;
  color: string;
}> = ({ color, size }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 5L9.85 10C9.5763 10.2563 9.35812 10.5659 9.20898 10.9099C9.05984 11.2539 8.98291 11.625 8.98291 12C8.98291 12.375 9.05984 12.7458 9.20898 13.0898C9.35812 13.4339 9.5763 13.7437 9.85 14L15 19"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default ChevronLeftIcon;

import React from "react";
import { Path, Svg } from "react-native-svg";

const SendComment: React.FC<{
  size: number;
  color: string;
}> = ({ color, size }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
    >
      <Path
        fill={color}
        d="M572.235 205.282v600.365a30.118 30.118 0 1 1-60.235 0V205.282L292.382 438.633a28.913 28.913 0 0 1-42.646 0 33.43 33.43 0 0 1 0-45.236l271.058-288.045a28.913 28.913 0 0 1 42.647 0L834.5 393.397a33.43 33.43 0 0 1 0 45.176 28.913 28.913 0 0 1-42.647 0l-219.618-233.23z"
      />
    </Svg>
  );
};

export default SendComment;

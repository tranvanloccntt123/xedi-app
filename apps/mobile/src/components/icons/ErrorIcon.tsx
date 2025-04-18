import React from "react";
import { Path, Svg } from "react-native-svg";

const ErrorIcon: React.FC<{
  size: number;
  color: string;
}> = ({ color, size }) => {
  return (
    <Svg fill={color} width={size} height={size} viewBox="-1.7 0 20.4 20.4">
      <Path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
    </Svg>
  );
};

export default ErrorIcon;

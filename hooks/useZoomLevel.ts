import React, { useEffect } from "react";

export const useZoomLevel = (defaultZoom: number) => {
  const [level, setLevel] = React.useState(defaultZoom);
  const [strokeWidth, setStrokeWidth] = React.useState(3);

  const updateStrokeWidth = (newLevel: number) => {
    switch (newLevel) {
      case 5:
      case 6:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
        return;
      case 16:
        setStrokeWidth(3);
        return;
      case 17:
        setStrokeWidth(5);
        return;
      case 18:
        setStrokeWidth(10);
        return;
      case 19:
        setStrokeWidth(12);
        return;
      default:
        setStrokeWidth(newLevel - 2 > 0 ? newLevel - 2 : newLevel);
        return;
    }
  };

  useEffect(() => {
    updateStrokeWidth(level);
  }, [level]);

  return {
    level,
    updateLevel: setLevel,
    strokeWidth,
  };
};

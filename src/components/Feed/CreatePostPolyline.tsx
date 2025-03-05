import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { ShapeSource, LineLayer } from "@maplibre/maplibre-react-native";
import { decodePolyline } from "../../lib/osrm";
import { ColorUtils } from "../../utils/color";

const CreatePostPolyline: React.FC<object> = () => {
  const routes = useSelector((state: RootState) => state.postForm?.routes || []);

  const lines = React.useMemo(() => {
    let _lines: [number, number][][] = [];
    routes.length &&
      routes.forEach((route) => {
        const coordinates = decodePolyline(route.geometry);
        _lines.push(coordinates);
      });
    return _lines;
  }, [routes]);

  const colors = React.useMemo(
    () => ColorUtils.gradient("#7790ba", "#0c47ab", lines.length || 1),
    [lines]
  );

  return (
    <>
      {lines
        .filter((line) => !!line.length)
        .map((line, i) => (
          <ShapeSource
            key={`line-${i}`}
            id={`polyline${i}Source`}
            shape={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: line,
              },
              properties: {},
            }}
          >
            <LineLayer
              id={`polyline${i}Source`}
              style={{
                lineColor: colors[i], // Red line
                lineWidth: 10,
                lineJoin: "bevel",
              }}
            />
          </ShapeSource>
        ))}
    </>
  );
};

export default CreatePostPolyline;

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { ShapeSource, LineLayer } from "@maplibre/maplibre-react-native";
import { decodePolyline } from "../../lib/osrm";

const CreatePostPolyline: React.FC<{
  type?: "fixed-route" | "trip-request";
}> = ({ type }) => {
  const routes = useSelector(
    (state: RootState) =>
      (type === "fixed-route"
        ? state.postForm?.fixedRoutes.routes
        : state.postForm?.tripRequest.routes) || []
  );

  const lines = React.useMemo(() => {
    let _lines: [number, number][][] = [];
    routes.length &&
      routes.forEach((route) => {
        const coordinates = decodePolyline(route.geometry);
        _lines.push(coordinates);
      });
    return _lines;
  }, [routes]);

  return (
    <>
      {lines.map((line, i) => (
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
              lineColor: "#7790ba", // Red line
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

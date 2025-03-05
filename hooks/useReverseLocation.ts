import { PhotonReverseResponse } from "@/src/types";
import axios from "axios";
import React from "react";
import useDebounce from "./useDebounce";
import { splitLocation } from "@/src/utils";

const useReverseLocation = (initCoordinate?: { lat: number; lon: number }) => {
  const debounce = useDebounce({ time: 200 });
  const [firstLoadData, setFirstLoadData] =
    React.useState<PhotonReverseResponse>();
  const [data, setData] = React.useState<PhotonReverseResponse>();
  const [coordinate, setCoordinate] = React.useState(initCoordinate);
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    setData(undefined);
    debounce(async () => {
      if (coordinate && coordinate.lat && coordinate.lon) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `https://photon.komoot.io/reverse?lat=${coordinate.lat}&lon=${coordinate.lon}`,
            {
              headers: {
                "access-control-allow-origin": "*",
              },
              timeout: 30000,
            }
          );
          setData(response.data);
          !firstLoadData && setFirstLoadData(response.data);
        } catch (error) {
          console.error("Error fetching locations:", error);
        } finally {
          setIsLoading(false);
        }
      }
    });
  }, [coordinate]);

  const { title, subTitle } = React.useMemo(() => {
    if (!data && !data?.features.length) {
      return {
        title: "",
        subTitle: "",
      };
    }
    return splitLocation(
      [
        data.features[0]?.properties?.name,
        data.features[0]?.properties?.street,
        data.features[0]?.properties?.locality,
        data.features[0]?.properties?.district,
        data.features[0]?.properties?.city,
        data.features[0]?.properties?.country,
      ]
        .filter((v) => !!v)
        .join(", ")
    );
  }, [data]);

  return {
    data,
    coordinate,
    setCoordinate,
    isLoading,
    title,
    subTitle,
    firstLoadData,
  };
};

export default useReverseLocation;

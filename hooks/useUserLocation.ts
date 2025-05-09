import { RootState } from "@/src/store/store";
import { useSelector } from "react-redux";

const useUserLocation = (defaultLocation?: { lat: number; lon: number }) => {
  const { lat, lon } = useSelector((state: RootState) => state.location);
  const user = useSelector((state: RootState) => state.auth.user);
  return {
    lat: lat || user.lat || defaultLocation?.lat || null,
    lon: lon || user.lon || defaultLocation?.lon || null,
  };
};

export default useUserLocation;

import { setGranted } from "@/src/store/locationSlice";
import { RootState } from "@/src/store/store";
import * as Location from "expo-location";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const useLocation = ({ isWatchLocation }: { isWatchLocation?: boolean }) => {
  const { granted } = useSelector((state: RootState) => state.location);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const dispatch = useDispatch();
  const requestPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    dispatch(setGranted(status === "granted"));
  };
  useEffect(() => {
    requestPermission();
  }, []);

  const subscription = async () => {
    const s = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,
      },
      () => {}
    );
    subscriptionRef.current = s;
  };

  useEffect(() => {
    if (isWatchLocation && granted) {
      subscription();
      return () => subscriptionRef.current?.remove();
    }
  }, [isWatchLocation, granted]);

  return {
    requestPermission,
  };
};

export default useLocation;

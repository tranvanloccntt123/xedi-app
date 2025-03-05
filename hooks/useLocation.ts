import { setGranted, setLocation } from "@/src/store/locationSlice";
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
      (location) => {
        dispatch(
          setLocation({
            lat: location.coords.latitude,
            lon: location.coords.longitude,
          })
        );
      }
    );
    subscriptionRef.current = s;
  };

  const requestLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,
      });
      dispatch(
        setLocation({
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        })
      );
    } catch (e) {}
  };

  useEffect(() => {
    if (isWatchLocation && granted) {
      subscription();
      return () => subscriptionRef.current?.remove();
    }
    if (!isWatchLocation && granted) {
      requestLocation();
    }
  }, [isWatchLocation, granted]);

  return {
    requestPermission,
  };
};

export default useLocation;

"use client";
import React, { useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  resetPost,
  setFixedRoutestart_location,
  setFixedRouteend_location,
  setFixedRouteLocation,
  setFixedRouteInputSelectionType,
} from "../../store/postForm/postFormSlice";
import { router } from "expo-router";
import { xediSupabase } from "supabase-client";
import LocationSearch from "./LocationSearch";
import { setAndFetchFixedRouteLocation } from "@/src/store/postForm/postFormThunks";

interface LocationSearchProps {
  defaultLocation?: InputLocation;
  onQueryFullfiled?: () => any;
  onConfirm?: () => any;
  isShareHide?: boolean;
}

export default function LocationSearchFixedRoute({
  defaultLocation,
  onQueryFullfiled,
  onConfirm,
  isShareHide,
}: LocationSearchProps) {
  const user: IUser | null = useSelector((state: RootState) => state.auth.user);

  const { inputSelectionType, start_location, end_location, departure_time } =
    useSelector((state: RootState) => state.postForm.fixedRoutes);

  const dispatch = useDispatch();

  const debounceSendEvent = useDebounce({ time: 100 });

  useEffect(() => {
    debounceSendEvent(() => {
      dispatch(setAndFetchFixedRouteLocation());
      onQueryFullfiled?.();
    });
  }, [start_location, end_location]);

  const handlerSwap = () => {
    const tmpend_location = end_location;
    const tmpstart_location = start_location;
    dispatch(setFixedRoutestart_location(tmpend_location));
    dispatch(setFixedRouteend_location(tmpstart_location));
  };

  return (
    <LocationSearch
      defaultLocation={defaultLocation}
      onConfirm={onConfirm}
      isShareHide={isShareHide}
      inputSelectionType={inputSelectionType}
      start_location={start_location}
      end_location={end_location}
      departure_time={departure_time}
      onSwap={handlerSwap}
      onSelectLocation={(item) => dispatch(setFixedRouteLocation(item))}
      onClearstart_location={() => dispatch(setFixedRoutestart_location())}
      onClearend_location={() => dispatch(setFixedRouteend_location())}
      onstart_locationFocus={() =>
        dispatch(setFixedRouteInputSelectionType("start-location"))
      }
      onend_locationFocus={() =>
        dispatch(setFixedRouteInputSelectionType("end-location"))
      }
    />
  );
}

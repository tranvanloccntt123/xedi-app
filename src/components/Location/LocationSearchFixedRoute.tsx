"use client";
import React, { useEffect } from "react";
import { InputLocation, IUser } from "../../types";
import useDebounce from "@/hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  resetPost,
  setFixedRouteStartLocation,
  setFixedRouteEndLocation,
  setFixedRouteLocation,
  setFixedRouteInputSelectionType,
} from "../../store/postForm/postFormSlice";
import { router } from "expo-router";
import { xediSupabase } from "../../lib/supabase";
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

  const { inputSelectionType, startLocation, endLocation, departureTime } =
    useSelector((state: RootState) => state.postForm.fixedRoutes);

  const dispatch = useDispatch();

  const debounceSendEvent = useDebounce({ time: 100 });

  useEffect(() => {
    debounceSendEvent(() => {
      dispatch(setAndFetchFixedRouteLocation());
      onQueryFullfiled?.();
    });
  }, [startLocation, endLocation]);

  const handlerSwap = () => {
    const tmpEndLocation = endLocation;
    const tmpStartLocation = startLocation;
    dispatch(setFixedRouteStartLocation(tmpEndLocation));
    dispatch(setFixedRouteEndLocation(tmpStartLocation));
  };

  return (
    <LocationSearch
      defaultLocation={defaultLocation}
      onConfirm={onConfirm}
      isShareHide={isShareHide}
      inputSelectionType={inputSelectionType}
      startLocation={startLocation}
      endLocation={endLocation}
      departureTime={departureTime}
      onSwap={handlerSwap}
      onSelectLocation={(item) => dispatch(setFixedRouteLocation(item))}
      onClearStartLocation={() => dispatch(setFixedRouteStartLocation())}
      onClearEndLocation={() => dispatch(setFixedRouteEndLocation())}
      onStartLocationFocus={() =>
        dispatch(setFixedRouteInputSelectionType("start-location"))
      }
      onEndLocationFocus={() =>
        dispatch(setFixedRouteInputSelectionType("end-location"))
      }
    />
  );
}

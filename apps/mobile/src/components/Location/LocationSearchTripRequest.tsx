"use client";
import React, { useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  setTripRequestInputSelectionType,
  setTripRequestLocation,
  setTripRequestStartLocation,
  setTripRequestEndLocation,
  resetPost,
} from "../../store/postForm/postFormSlice";
import { setAndFetchRouteLocation } from "../../store/postForm/postFormThunks";
import { router } from "expo-router";
import { xediSupabase } from "supabase-client";
import LocationSearch from "./LocationSearch";

interface LocationSearchProps {
  defaultLocation?: InputLocation;
  onQueryFullfiled?: () => any;
  onConfirm?: () => any;
  isShareHide?: boolean;
}

export default function LocationSearchTripRequest({
  defaultLocation,
  onQueryFullfiled,
  onConfirm,
  isShareHide,
}: LocationSearchProps) {
  const user: IUser | null = useSelector((state: RootState) => state.auth.user);

  const { inputSelectionType, startLocation, endLocation, departureTime } =
    useSelector((state: RootState) => state.postForm.tripRequest);

  const dispatch = useDispatch();

  const debounceSendEvent = useDebounce({ time: 100 });

  useEffect(() => {
    if (startLocation && endLocation)
      debounceSendEvent(() => {
        dispatch(setAndFetchRouteLocation());
        onQueryFullfiled?.();
      });
  }, [startLocation, endLocation]);

  const handlerSwap = () => {
    const tmpEndLocation = endLocation;
    const tmpStartLocation = startLocation;
    dispatch(setTripRequestStartLocation(tmpEndLocation));
    dispatch(setTripRequestEndLocation(tmpStartLocation));
  };

  return (
    <LocationSearch
      defaultLocation={defaultLocation}
      onConfirm={() =>
        onConfirm
          ? onConfirm?.()
          : async () => {
              const { data: tripRequestData } =
                await xediSupabase.tables.tripRequest.add([
                  {
                    startLocation,
                    endLocation,
                    user_id: user.id,
                    departureTime,
                    type: "Taxi",
                  },
                ]);
              dispatch(resetPost({}));
              router.back();
            }
      }
      isShareHide={isShareHide}
      inputSelectionType={inputSelectionType}
      startLocation={startLocation}
      endLocation={endLocation}
      departureTime={departureTime}
      onSwap={handlerSwap}
      onSelectLocation={(item) => dispatch(setTripRequestLocation(item))}
      onClearStartLocation={() => dispatch(setTripRequestStartLocation())}
      onClearEndLocation={() => dispatch(setTripRequestEndLocation())}
      onStartLocationFocus={() =>
        dispatch(setTripRequestInputSelectionType("start-location"))
      }
      onEndLocationFocus={() =>
        dispatch(setTripRequestInputSelectionType("end-location"))
      }
    />
  );
}

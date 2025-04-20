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

  const { inputSelectionType, start_location, end_location, departure_time } =
    useSelector((state: RootState) => state.postForm.tripRequest);

  const dispatch = useDispatch();

  const debounceSendEvent = useDebounce({ time: 100 });

  useEffect(() => {
    if (start_location && end_location)
      debounceSendEvent(() => {
        dispatch(setAndFetchRouteLocation());
        onQueryFullfiled?.();
      });
  }, [start_location, end_location]);

  const handlerSwap = () => {
    const tmpEndLocation = end_location;
    const tmpStartLocation = start_location;
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
                    start_location,
                    end_location,
                    user_id: user.id,
                    departure_time,
                    type: "Taxi",
                  },
                ]);
              dispatch(resetPost({}));
              router.back();
            }
      }
      isShareHide={isShareHide}
      inputSelectionType={inputSelectionType}
      startLocation={start_location}
      endLocation={end_location}
      departure_time={departure_time}
      onSwap={handlerSwap}
      onSelectLocation={(item) => dispatch(setTripRequestLocation(item))}
      onClearStartLocation={() => dispatch(setTripRequestStartLocation())}
      onClearEndLocation={() => dispatch(setTripRequestendLocation())}
      onStartLocationFocus={() =>
        dispatch(setTripRequestInputSelectionType("start-location"))
      }
      onEndLocationFocus={() =>
        dispatch(setTripRequestInputSelectionType("end-location"))
      }
    />
  );
}

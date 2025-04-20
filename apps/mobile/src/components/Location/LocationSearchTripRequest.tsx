"use client";
import React, { useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  setTripRequestInputSelectionType,
  setTripRequestLocation,
  setTripRequeststart_location,
  setTripRequestend_location,
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
    const tmpend_location = end_location;
    const tmpstart_location = start_location;
    dispatch(setTripRequeststart_location(tmpend_location));
    dispatch(setTripRequestend_location(tmpstart_location));
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
      start_location={start_location}
      end_location={end_location}
      departure_time={departure_time}
      onSwap={handlerSwap}
      onSelectLocation={(item) => dispatch(setTripRequestLocation(item))}
      onClearstart_location={() => dispatch(setTripRequeststart_location())}
      onClearend_location={() => dispatch(setTripRequestend_location())}
      onstart_locationFocus={() =>
        dispatch(setTripRequestInputSelectionType("start-location"))
      }
      onend_locationFocus={() =>
        dispatch(setTripRequestInputSelectionType("end-location"))
      }
    />
  );
}

import React, { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setTripRequestInputSelectionType } from "@/src/store/postForm/postFormSlice";
import useLocation from "@/hooks/useLocation";
import TripRequestMapSelectionLayout from "@/src/components/TripRequest/TripRequestMapSelectionLayout";

export default function CreatePostLocation() {
  useLocation({ isWatchLocation: true });
  const { type } = useLocalSearchParams<{
    type: "startLocation" | "endLocation";
  }>();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (type === "startLocation") {
      dispatch(setTripRequestInputSelectionType("start-location"));
    } else {
      dispatch(setTripRequestInputSelectionType("end-location"));
    }
  }, [type]);

  return (
    <TripRequestMapSelectionLayout
      isShareHide={true}
      onConfirm={() => router.back()}
    />
  );
}

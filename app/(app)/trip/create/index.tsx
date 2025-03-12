import React from "react";
import useLocation from "@/hooks/useLocation";
import { useDispatch } from "react-redux";
import { SelectLocationType } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { resetPost } from "@/src/store/post/postFormSlice";
import TripRequestMapSelectionLayout from "@/src/components/TripRequest/TripRequestMapSelectionLayout";

export default function CreateTripRequestOnly() {
  useLocation({ isWatchLocation: true });
  const { type } = useLocalSearchParams<{ type: SelectLocationType }>();

  const dispatch = useDispatch();

  React.useEffect(() => {
    // Reset the post slice when the component mounts
    dispatch(resetPost({ inputSelectionType: type }));
  }, [dispatch]);

  return <TripRequestMapSelectionLayout />;
}

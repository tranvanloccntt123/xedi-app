import React from "react";
import { HStack } from "../ui/hstack";
import useQuery from "@/hooks/useQuery";
import { XEDI_QUERY_KEY } from "@/src/store/fetchServices/fetchServicesSlice";
import { xediSupabase } from "@/src/lib/supabase";

const HomeListUserLocation: React.FC<object> = () => {
  const {data} = useQuery({
    queryKey: XEDI_QUERY_KEY.YOUR_LOCATIONS_STORED,
    async queryFn() {
      return xediSupabase.tables.userLocationStore.selectByUserIdAfterDate({
        pageNums: 4,
      });
    },
  });
  return <HStack space="sm"></HStack>;
};

export default HomeListUserLocation;

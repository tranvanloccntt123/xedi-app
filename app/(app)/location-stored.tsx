import React from "react";
import { Box } from "@/src/components/ui/box";
import { SafeAreaView } from "react-native-safe-area-context";
import AppStyles from "@/src/theme/AppStyles";
import Header from "@/src/components/Header";
import useQuery from "@/hooks/useQuery";
import { XEDI_QUERY_KEY } from "@/src/store/fetchServices/fetchServicesSlice";
import { xediSupabase } from "@/src/lib/supabase";

export default function LocationStored() {
  const { refetch, data } = useQuery({
    queryKey: XEDI_QUERY_KEY.YOUR_LOCATIONS_STORED,
    async queryFn() {
      const { data } =
        await xediSupabase.tables.userLocationStore.selectByUserIdAfterDate({
          pageNums: 4,
        });
      return data || [];
    },
  });

  return (
    <Box className="flex-1 bg-xedi-background">
      <SafeAreaView style={AppStyles.container}>
        <Header title="Địa chỉ đã lưu" className="px-[16px]" />
      </SafeAreaView>
    </Box>
  );
}

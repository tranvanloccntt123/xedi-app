import React from "react";
import { Box } from "@/src/components/ui/box";
import { SafeAreaView } from "react-native-safe-area-context";
import { xediSupabase } from "@/src/lib/supabase";
import { Tables } from "@/src/constants";
import { HStack } from "@/src/components/ui/hstack";
import { Avatar, AvatarFallbackText } from "@/src/components/ui/avatar";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import moment from "moment";
import InfinityList from "@/src/components/InfinityList";

const select = `id, body, created_at, ${Tables.USERS}(*)`;

export default function History() {
  return (
    <Box className="flex-1 bg-gray-100">
      <SafeAreaView style={{ flex: 1 }}>
        <InfinityList
          renderItem={({ item, index, data }) => (
            <Box>
              {(index === 0 ||
                moment(item?.created_at).format("DD/MM/YYYY") !=
                  moment(data[index - 1]?.created_at).format("DD/MM/YYYY")) && (
                <Box className="h-[35px] mt-[16px] justify-center">
                  <Text className="mb-2 mx-4 text-md font-bold text-gray-500">
                    {moment(item?.created_at).format("DD/MM/YYYY")}
                  </Text>
                </Box>
              )}
              <HStack className="bg-white p-4 items-center" space="md">
                <Avatar>
                  <AvatarFallbackText>
                    {item.users?.name || "Xe Di"}
                  </AvatarFallbackText>
                </Avatar>
                <VStack className="flex-1">
                  <Text className="text-bold text-md flex-1">{item.body}</Text>
                  <Text className="text-thin text-gray-500 text-xs">
                    {moment(item?.created_at).format("hh:mm")}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          )}
          queryFn={async function (lastPage: any): Promise<any[]> {
            const { data } =
              await xediSupabase.tables.notifications.selectByUserIdBeforeDate({
                select,
                date: lastPage,
              });
            return data || [];
          }}
          getLastPageNumber={function (lastData: any[]) {
            return lastData?.[lastData.length - 1]?.created_at;
          }}
        />
      </SafeAreaView>
    </Box>
  );
}

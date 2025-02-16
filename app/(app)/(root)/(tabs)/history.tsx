import React from "react";
import { Box } from "@/src/components/ui/box";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { INotification } from "@/src/types";
import { xediSupabase } from "@/src/lib/supabase";
import { Tables } from "@/src/constants";
import { FlatList, Platform, RefreshControl } from "react-native";
import { B } from "@expo/html-elements";
import { HStack } from "@/src/components/ui/hstack";
import { Avatar, AvatarFallbackText } from "@/src/components/ui/avatar";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import moment from "moment";

const select = `id, body, created_at, ${Tables.USERS}(*)`;

export default function History() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = React.useState<INotification[]>([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      const { data } =
        await xediSupabase.tables.notifications.selectByUserIdAfterId({
          select,
        });
      if (data) {
        setData(data);
      } // Just reverse the order for demo purposes
      setRefreshing(false);
    }, 2000);
  }, []);

  React.useEffect(() => {
    const test = async () => {
      const { data } =
        await xediSupabase.tables.notifications.selectByUserIdAfterId({
          select,
        });
      if (data) {
        console.log(JSON.stringify(data));
        setData(data);
      }
    };

    test();
  }, []);

  return (
    <Box className="flex-1 bg-gray-100">
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <Box>
              {(index === 0 ||
                moment(item?.created_at).format("DD/MM/YYYY") !=
                  moment(data[index - 1]?.created_at).format("DD/MM/YYYY")) && (
                <Text className="mb-2 px-2 text-sm text-gray-500">{moment(item?.created_at).format("DD/MM/YYYY")}</Text>
              )}
              <HStack
                className="mb-2 bg-white p-4 rounded-full items-center"
                space="md"
              >
                <Avatar>
                  <AvatarFallbackText>
                    {item.users?.name || "Xe Di"}
                  </AvatarFallbackText>
                </Avatar>
                <VStack>
                  <Text className="text-bold text-lg">{item.body}</Text>
                  <Text className="text-thin text-gray-500 text-xs">
                    {moment(item.created_at).format("hh:mm")}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          )}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={Platform.OS === "web"}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </SafeAreaView>
    </Box>
  );
}

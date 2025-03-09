import React from "react";
import useQueryInfinity, { InfinityQuery } from "@/hooks/useQueryInfinity";
import { FlatList, Platform, RefreshControl } from "react-native";

interface InfinityListProps<TData = { id: string | number } & any, TPage = any>
  extends InfinityQuery<TData, TPage> {
  ListEmptyComponent?: React.ReactNode;
  ListHeaderComponent?: React.ReactNode;
  renderItem: (data: {
    item: TData;
    index: number;
    data?: TData[];
  }) => React.ReactNode;
}

const InfinityList: React.FC<InfinityListProps> = ({
  queryFn,
  queryKey,
  initPage,
  getLastPageNumber,
  refreshCallback,
  refreshTimeout,
  renderItem,
  ListHeaderComponent,
  ListEmptyComponent,
}) => {
  const { data, isRefreshing, refresh, isLoading, fetchNextPage } =
    useQueryInfinity({
      queryFn,
      queryKey,
      initPage,
      getLastPageNumber,
      refreshCallback,
      refreshTimeout,
    });

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) =>
        `${queryKey || "Infinity"}-${item?.id}-${index}`
      }
      renderItem={({ item, index }) =>
        renderItem({ item, index, data }) as never
      }
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
      }
      ListHeaderComponent={ListHeaderComponent as never}
      ListEmptyComponent={ListEmptyComponent as never}
      showsVerticalScrollIndicator={Platform.OS === "web"}
    />
  );
};

export default InfinityList;

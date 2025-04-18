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

export interface InfinityListMethods {
  refresh: () => Promise<void>;
  push: (item: any, index: number) => any;
}

const InfinityList = React.forwardRef<InfinityListMethods, InfinityListProps>(
  (
    {
      queryFn,
      queryKey,
      initPage,
      getLastPageNumber,
      refreshCallback,
      refreshTimeout,
      renderItem,
      ListHeaderComponent,
      ListEmptyComponent,
    },
    ref
  ) => {
    const { data, isRefreshing, refresh, isLoading, fetchNextPage, push } =
      useQueryInfinity({
        queryFn,
        queryKey,
        initPage,
        getLastPageNumber,
        refreshCallback,
        refreshTimeout,
      });

    React.useImperativeHandle(ref, () => {
      return {
        async refresh() {
          refresh();
        },
        push,
      };
    });

    const _renderItem = React.useCallback(
      ({ item, index }: { item: any; index: number }) => {
        return renderItem({ item, index, data }) as never;
      },
      [data]
    );

    return (
      <FlatList
        data={data}
        keyExtractor={(item, index) =>
          `${queryKey || "Infinity"}-${item?.id}-${index}`
        }
        renderItem={_renderItem}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
        ListHeaderComponent={ListHeaderComponent as never}
        ListEmptyComponent={ListEmptyComponent as never}
        showsVerticalScrollIndicator={Platform.OS === "web"}
        onEndReached={() => fetchNextPage()}
      />
    );
  }
);

export default InfinityList;

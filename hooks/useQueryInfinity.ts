import React from "react";

export interface InfinityQuery<TData = any, TPage = any> {
  queryKey?: string;
  initPage?: TPage;
  queryFn: (lastPage: TPage) => Promise<TData[]>;
  getLastPageNumber: (lastData: TData[]) => TPage;
  refreshTimeout?: number;
  refreshCallback?: () => any;
}

const useQueryInfinity = <TData = any, TPage = any>(
  query: InfinityQuery<TData, TPage>
) => {
  const [data, setData] = React.useState<TData[]>([]);
  const hashId = React.useRef<Set<string | number>>(new Set());
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  const pageNum = React.useRef<TPage>(query.initPage);

  const fetch = async (params?: { isRefresh: boolean }) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const _data = await query.queryFn(pageNum.current);
      if (_data.length) {
        const newData = params?.isRefresh ? [] : data.concat();
        if (params?.isRefresh) {
          hashId.current = new Set();
        }
        _data.forEach((item: any) => {
          if (hashId.current.has(item.id)) {
            return;
          }
          newData.push(item);
          hashId.current.add(item.id);
        });
        pageNum.current = query.getLastPageNumber(_data);
        setData(newData);
      }
    } catch (e) {
      setData([]);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetch();
  }, []);

  const refresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    pageNum.current = query.initPage;
    hashId.current = new Set();
    setTimeout(async () => {
      await fetch({ isRefresh: true });
      await query.refreshCallback?.();
      setIsRefreshing(false);
    }, query.refreshTimeout || 10);
  };

  return {
    fetchNextPage: fetch,
    data,
    isLoading,
    isRefreshing,
    refresh,
    push(item: TData, index: number) {
      if (hashId.current.has((item as any).id)) {
        return;
      }
      if (data.length) {
        setData([...data.slice(0, index), item, ...data.slice(index)]);
      } else {
        setData([item]);
      }
      hashId.current.add((item as any).id);
    },
  };
};

export default useQueryInfinity;

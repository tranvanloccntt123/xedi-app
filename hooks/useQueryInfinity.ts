import React from "react";

interface Query<TData = any, TPage = any> {
  queryKey?: string;
  initPage?: TPage;
  queryFn: (lastPage: TPage) => Promise<TData[]>;
  getLastPageNumber: (lastData: TData[]) => TPage;
  refreshTimeout?: number;
  refreshCallback?: () => any;
}

const useQueryInfinity = <TData = any, TPage = any>(
  query: Query<TData, TPage>
) => {
  const [data, setData] = React.useState<TData[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  const pageNum = React.useRef<TPage>(query.initPage);

  const fetch = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const _data = await query.queryFn(pageNum.current);
      const newData = data.concat();
      newData.push(..._data);
      pageNum.current = query.getLastPageNumber(_data);
      setData(newData);
    } catch (e) {}
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetch();
  }, []);

  const refresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    pageNum.current = query.initPage;
    setTimeout(async () => {
      await fetch();
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
  };
};

export default useQueryInfinity;

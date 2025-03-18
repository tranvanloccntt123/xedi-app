import React from "react";
import { RootState } from "@/src/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  endFetchingError,
  endFetchingSuccess,
  startFetching,
} from "@/src/store/fetchServices/fetchServicesSlice";

export interface QueryParams<TData = any> {
  queryKey: string;
  queryFn: () => Promise<TData>;
}

export const useDataInfo = <TData = any>(queryKey: string) => {
  const _store = useSelector(
    (state: RootState) => state.fetchServices.requests[queryKey]
  );
  return {
    data: _store.data as TData,
    isLoading: _store.isLoading === true,
    isError: _store.isError === true,
    errorMessage: _store.errorMessage || "",
  };
};

const useQuery = <TData = any>(params: QueryParams<TData>) => {
  const dispatch = useDispatch();

  const _store = useSelector(
    (state: RootState) => state.fetchServices.requests[params.queryKey]
  );

  const fetch = async () => {
    if (_store.isLoading) return;
    dispatch(startFetching(params.queryKey));
    try {
      const data = await params.queryFn();
      dispatch(endFetchingSuccess({ key: params.queryKey, data }));
    } catch (e) {
      dispatch(endFetchingError({ key: params.queryKey, errorMessage: e }));
    }
  };

  React.useEffect(() => {
    fetch();
  }, []);

  return {
    data: _store.data,
    isLoading: _store.isLoading === true,
    isError: _store.isError === true,
    errorMessage: _store.errorMessage || "",
    refetch: fetch,
  };
};

export default useQuery;

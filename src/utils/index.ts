import { EnhancedStore } from "@reduxjs/toolkit";
import { RootState, store } from "../store/store";

export const findUser = (phone: string, password: string) => {
  const { getState } = store as EnhancedStore<RootState>;
  const { user } = getState();
  return Object.values(user.users).find(
    (u) => u.phone === phone && u.password === password
  );
};
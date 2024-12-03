import { useContext } from "react";
import { RealmContext } from "../contexts/RealmContext";

export const useRealm = () => {
  return RealmContext.useRealm();
};

export const useQuery = RealmContext.useQuery;
export const useObject = RealmContext.useObject;


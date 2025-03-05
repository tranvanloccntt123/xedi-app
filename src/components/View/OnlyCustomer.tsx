import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { IUser } from "../../types";

const OnlyCustomer: React.FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const user: IUser | null = useSelector((state: RootState) => state.auth.user);
  if (!user || user.role === "driver") {
    return <></>;
  }
  return children;
};

export default OnlyCustomer;

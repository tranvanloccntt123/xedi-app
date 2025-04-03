import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const OnlyDriver: React.FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const user: IUser | null = useSelector((state: RootState) => state.auth.user);
  if (!user || user.role === "customer") {
    return <></>;
  }
  return children;
};

export default OnlyDriver;

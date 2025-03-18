import Cookies from "js-cookie";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { USER_ACCESS_KEY } from "../utils/enum";
import { useGetUserDetails } from "./service";

type User = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
} | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const getUserDetails = useGetUserDetails();

  const logout = () => {
    setUser(null);
    Cookies.remove(USER_ACCESS_KEY.TOKEN);
    Cookies.remove(USER_ACCESS_KEY.ORGANIZATION_ID);
    Cookies.remove(USER_ACCESS_KEY.ORGANIZATION_NAME);
  };

  useEffect(() => {
    if (Cookies.get(USER_ACCESS_KEY.TOKEN)) {
      if (getUserDetails.isSuccess && getUserDetails.data) {
        setUser(getUserDetails.data.user);
      }
    }
  }, [getUserDetails.isSuccess, getUserDetails.data]);

  useEffect(() => {
    if (getUserDetails.isError) {
      if (Cookies.get(USER_ACCESS_KEY.TOKEN)) {
        Cookies.remove(USER_ACCESS_KEY.TOKEN);
        setUser(null);
      }
      if (
        !window.location.pathname.includes("/signin") &&
        !window.location.pathname.includes("/signup") &&
        !window.location.pathname.includes("/join-organization") &&
        !window.location.pathname.includes("/forgot-password")
      ) {
        window.location.href = "/signin";
      }
    }
  }, [getUserDetails.isError]);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

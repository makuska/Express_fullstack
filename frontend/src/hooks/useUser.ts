import {useContext} from "react";
import {useLocalStorage} from "./useLocalStorage.ts";
import {User} from "../types/authTypes.ts";
import {AuthContext} from "../context/AuthContext.tsx";

export function useUser(){
  const {user, setUser} = useContext(AuthContext)
  const { setItem } = useLocalStorage()

  const addUser = (user: User) => {
    setUser(user);
    setItem("user", JSON.stringify(user));
  };

  const removeUser = () => {
    setUser(null);
    setItem("user", "");
  };

  return { user, addUser, removeUser, setUser };
}
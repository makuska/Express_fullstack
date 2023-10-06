import { useEffect } from "react";
import { useUser } from "./useUser";
import { useLocalStorage } from "./useLocalStorage";
import {frontendUserLogin, frontendUserLogout} from "../services/authService.ts";
import {User} from "../types/authTypes.ts";
import {useNavigate} from "react-router-dom";

export const useAuth = () => {
  const { user, addUser, removeUser, setUser } = useUser();
  const { getItem } = useLocalStorage();
  const navigate = useNavigate()

  useEffect(() => {
    const user = getItem("user");
    if (user) {
      addUser(JSON.parse(user));
    }
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    const user: User = {
      username: username,
      email: 'sampleEmail'
    }
    console.log(user)
    try {
      await frontendUserLogin(username, password);
      // Another possibility is to return the user data from the function above and then create the User object
      addUser(user);
      console.log(user)
      console.log(user.username)
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
      // if (user) navigate('/dashboard')
    } catch (error) {
      throw Error("Unable to log in, please try again!")
    }
  };

  const logout = async () => {
    try {
      await frontendUserLogout()
      removeUser()
      navigate('/')
    } catch (e) {
      throw Error("Unable to log out, please try again!")
    }
  };

  return { user, login, logout, setUser };
};
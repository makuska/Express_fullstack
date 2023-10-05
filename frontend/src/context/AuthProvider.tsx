import { createContext, useContext, useState } from 'react';
import {frontendUserLogin} from "../services/authService.ts";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      await frontendUserLogin(username, password);
      // Optionally, you can add logic here to handle any further actions after login.
    } catch (error) {
      throw Error("Unable to log in, please try again!")
    }
  };

  const logout = () => {
    // Clear user data to log out
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

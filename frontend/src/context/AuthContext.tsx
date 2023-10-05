import React, { createContext } from "react";
import { AuthContextType } from '../types/authTypes.ts'

export const AuthContext: React.Context<AuthContextType> = createContext<AuthContextType>({
  user: null,
  setUser: (): void => {},
});
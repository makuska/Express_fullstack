// import {createContext, ReactNode, useContext, useState} from 'react';
// import {frontendUserLogin} from "../services/authService.ts";
// import {AuthProviderType} from "../types/authTypes.ts";
//
// // The default value is only used when a component tries to consume the context outside of the AuthProvider component
// const AuthContext = createContext<AuthProviderType | null>(null);
//
// type Props = {
//   children: ReactNode
// }
//
// export function AuthProvider({ children }: Props) {
//   const [user, setUser] = useState(null);
//
//   const login = async (username: string, password: string): Promise<void> => {
//     try {
//       await frontendUserLogin(username, password);
//       // Optionally, you can add logic here to handle any further actions after login.
//     } catch (error) {
//       throw Error("Unable to log in, please try again!")
//     }
//   };
//
//   const logout = (): void => {
//     // Clear user data to log out
//     setUser(null);
//   };
//
//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
//
// export const useAuth = () => {
//   const context: AuthProviderType | null = useContext(AuthContext);
//   if (context === null) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
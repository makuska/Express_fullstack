export interface LoginResponse {
  name: string,
  refreshToken: string,
  accessToken: string
}

// export interface AuthProviderType {
//   user: {} | null,
//   login: (username: string, password: string) => Promise<void>,
//   logout: () => void
// }

export interface User {
  username: string;
  email: string;
  authToken?: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}
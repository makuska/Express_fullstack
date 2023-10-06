export interface LoginResponse {
  name: string,
  refreshToken: string,
  accessToken: string
}

export interface User {
  username: string;
  email: string;
  authToken?: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}
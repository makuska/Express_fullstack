export interface LoginResponse {
  resUser: User
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
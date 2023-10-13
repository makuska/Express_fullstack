export interface LoginResponse {
  resUser: User
  refreshToken: string,
  accessToken: string
}

export interface User {
  username: string;
  email: string;
  userId?: string
  role?: string
}

export interface RefreshTokenResponse {
  resUser?: {
    userId: string;
    role: string;
  };
  message: string;
}


export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}
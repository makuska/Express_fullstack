export interface LoginResponseType {
  name: string,
  refreshToken: string,
  accessToken: string
}

export interface AuthProviderType {
  user: {} | null,
  login: (username: string, password: string) => Promise<void>,
  logout: () => void
}
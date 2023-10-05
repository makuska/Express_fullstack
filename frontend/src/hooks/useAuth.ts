import {useLocalStorage} from "./useLocalStorage.ts";
import {parseJwt} from "../utils/tokenUtils.ts";

function useAuth() {
  const {getItem} = useLocalStorage()
  const token = getItem('accessToken')
  let isUser = false
  let isAdmin = false

  if (token) {
    const decodedToken = parseJwt(token)
    const { username, role } = decodedToken

    if (role === 'admin') isAdmin = true
    if (role === 'user') isUser = true

    return { username, role, isAdmin, isUser }
  }

  return { username: '', role: '', isUser, isAdmin }
}

export default useAuth
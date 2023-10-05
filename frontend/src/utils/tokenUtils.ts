import {useLocalStorage} from "../hooks/useLocalStorage.ts";

export function parseJwt (token: string) {
  let base64Url: string = token.split('.')[1];
  let base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload: string = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export function authHeader(): {accessToken: string} | {} {
  const {getItem} = useLocalStorage()
  const token = getItem('accessToken')

  if (token) {
    return { 'accessToken': `Bearer ${token}`}
  } else {
    return {}
  }
}
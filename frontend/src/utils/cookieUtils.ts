export function getCookieKeyFromBackend(key: string) {
  let cookie = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return cookie ? cookie.pop() : "";
}
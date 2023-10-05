import { useState } from "react";

export const useCookie = () => {
  const [cookieValue, setCookieValue] = useState<string | null>(null);

  const setCookie = (key: string, value: string, daysToExpire: number, path: string = '/'): void => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysToExpire);

    document.cookie = `${key}=${value}; expires=${expirationDate.toUTCString()}; path=${path}`;
    setCookieValue(value);
  };

  const getCookie = (key: string) => {
    const cookies: string = document.cookie
    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.split('=')
      if (cookieKey === key) {
        setCookieValue(cookieValue)
        return cookieValue
      } else {
        return `No cookie(${cookieKey}) found!`
      }
    }
  };

  const removeCookie = (key: string) => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    setCookieValue(null);
  };

  return { value: cookieValue, setCookie, getCookie, removeCookie };
};
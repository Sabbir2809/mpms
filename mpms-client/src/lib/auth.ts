import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  COOKIE_USER,
} from "@/constants";
import type { AuthTokens, AuthUser } from "@/types";
import Cookies from "js-cookie";

const COOKIE_OPTS: Cookies.CookieAttributes = {
  expires: 7,
  sameSite: "Strict",
  secure: process.env.NODE_ENV === "production",
};

export const setAuthCookies = (tokens: AuthTokens, user: AuthUser): void => {
  Cookies.set(COOKIE_ACCESS_TOKEN, tokens.accessToken, COOKIE_OPTS);
  Cookies.set(COOKIE_REFRESH_TOKEN, tokens.refreshToken, {
    ...COOKIE_OPTS,
    expires: 7,
  });
  Cookies.set(COOKIE_USER, JSON.stringify(user), COOKIE_OPTS);
};

export const clearAuthCookies = (): void => {
  Cookies.remove(COOKIE_ACCESS_TOKEN);
  Cookies.remove(COOKIE_REFRESH_TOKEN);
  Cookies.remove(COOKIE_USER);
};

export const getAccessToken = (): string | undefined =>
  Cookies.get(COOKIE_ACCESS_TOKEN);

export const getRefreshToken = (): string | undefined =>
  Cookies.get(COOKIE_REFRESH_TOKEN);

export const getUserFromCookie = (): AuthUser | null => {
  const raw = Cookies.get(COOKIE_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => !!getAccessToken();

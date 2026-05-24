import type { AuthResponse, LoginInput, RegisterInput } from "@/types";
import { api } from "./api";

export const authService = {
  login: (data: LoginInput) => api.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterInput) =>
    api.post<AuthResponse>("/auth/register", data),

  logout: () => api.post<null>("/auth/logout"),

  getMe: () => api.get<AuthResponse["user"]>("/auth/me"),

  refresh: (refreshToken: string) =>
    api.post<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
      refreshToken,
    }),
};

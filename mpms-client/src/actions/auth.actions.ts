"use server";

import {
  API_URL,
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  COOKIE_USER,
} from "@/constants";
import type { AuthResponse, LoginInput, RegisterInput } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

export async function loginAction(data: LoginInput) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) {
    return { success: false, message: json.message || "Login failed" };
  }

  const { user, tokens } = json.data as AuthResponse;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_ACCESS_TOKEN, tokens.accessToken, {
    ...COOKIE_OPTS,
    maxAge: 60 * 15,
  });
  cookieStore.set(COOKIE_REFRESH_TOKEN, tokens.refreshToken, {
    ...COOKIE_OPTS,
    maxAge: 60 * 60 * 24 * 7,
  });
  cookieStore.set(COOKIE_USER, JSON.stringify(user), {
    ...COOKIE_OPTS,
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true, user };
}

export async function registerAction(data: RegisterInput) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) {
    return { success: false, message: json.message || "Registration failed" };
  }

  const { user, tokens } = json.data as AuthResponse;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_ACCESS_TOKEN, tokens.accessToken, {
    ...COOKIE_OPTS,
    maxAge: 60 * 15,
  });
  cookieStore.set(COOKIE_REFRESH_TOKEN, tokens.refreshToken, {
    ...COOKIE_OPTS,
    maxAge: 60 * 60 * 24 * 7,
  });
  cookieStore.set(COOKIE_USER, JSON.stringify(user), {
    ...COOKIE_OPTS,
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true, user };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;

  if (token) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      /* ignore network errors on logout */
    }
  }

  cookieStore.delete(COOKIE_ACCESS_TOKEN);
  cookieStore.delete(COOKIE_REFRESH_TOKEN);
  cookieStore.delete(COOKIE_USER);
  redirect("/login");
}

export async function getServerUser() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_USER)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResponse["user"];
  } catch {
    return null;
  }
}

export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_ACCESS_TOKEN)?.value ?? null;
}

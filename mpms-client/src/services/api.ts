import { API_URL } from "@/constants";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "@/lib/auth";
import type { ApiResponse } from "@/types";

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

const processQueue = (token: string): void => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearAuthCookies();
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  const data = await res.json();
  const tokens = data.data;
  const user = JSON.parse(
    document.cookie.match(/mpms_user=([^;]+)/)?.[1] ?? "null",
  );
  if (user) setAuthCookies(tokens, user);
  return tokens.accessToken as string;
};

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

const apiFetch = async <T>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> => {
  const { params, ...init } = options;

  const url = new URL(`${API_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    });
  }

  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const doRequest = async (accessToken?: string): Promise<Response> => {
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    return fetch(url.toString(), { ...init, headers });
  };

  let response = await doRequest();

  if (response.status === 401) {
    if (isRefreshing) {
      const newToken = await new Promise<string>((resolve) => {
        refreshQueue.push(resolve);
      });
      response = await doRequest(newToken);
    } else {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        processQueue(newToken);
        response = await doRequest(newToken);
      } catch {
        clearAuthCookies();
        if (typeof window !== "undefined") window.location.href = "/login";
        throw new Error("Authentication failed");
      } finally {
        isRefreshing = false;
      }
    }
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(`Unexpected content-type: ${contentType}`);
  }

  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    const message = json.message || `HTTP ${response.status}`;
    throw Object.assign(new Error(message), {
      status: response.status,
      data: json,
    });
  }

  return json;
};

/* ── HTTP verbs ── */
export const api = {
  get: <T>(path: string, params?: FetchOptions["params"]) =>
    apiFetch<T>(path, { method: "GET", params }),

  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};

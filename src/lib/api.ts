const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type ApiResponse<T> = T & { message?: string };

export const apiRequest = async <T = Record<string, JsonValue>>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }

  return data as ApiResponse<T>;
};

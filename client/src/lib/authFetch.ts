import { useAuth } from "@/store/auth";

export const authFetch = async (input: RequestInfo, init: RequestInit = {}) => {
  const { token } = useAuth.getState();

  const headers = {
    ...(init.headers || {}),
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  return fetch(input, {
    ...init,
    headers,
  });
};

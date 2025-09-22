import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;
// const BACKEND = "https://localhost:8888";

let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => (accessToken = token);
export const getAccessToken = () => accessToken;

/**
 * Create axios instance that talks directly to backend
 * We set withCredentials true so refresh-cookie (HttpOnly) is sent on refresh/logout calls.
 */
const api: AxiosInstance = axios.create({
  baseURL: `${BACKEND}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/**
 * Request interceptor - attach access token from memory.
 */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

/**
 * Refresh logic with queue to handle concurrent 401s.
 */
let isRefreshing = false;
let refreshQueue: {
  resolve: (value?: unknown) => void;
  reject: (err: any) => void;
  originalRequest: AxiosRequestConfig;
}[] = [];

async function refreshAccessToken(): Promise<string> {
  const res = await axios.post(
    `${BACKEND}/api/auth/refresh`,
    {},
    { withCredentials: true }
  );
  const { accessToken: newToken } = res.data;
  setAccessToken(newToken);
  return newToken;
}

api.interceptors.response.use(
  (resp) => resp,
  async (error: AxiosError & { config?: AxiosRequestConfig }) => {
    const originalRequest = error.config! as InternalAxiosRequestConfig & { _retry?: boolean };;
    if (!originalRequest || !error.response) return Promise.reject(error);

    // If unauthorized and request not already retried
    if (error.response.status === 401 && !originalRequest._retry) {
      // mark retry to avoid infinite loop
      originalRequest._retry = true;

      if (isRefreshing) {
        // queue request until refresh finished
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject, originalRequest });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        // resolve queued requests
        refreshQueue.forEach((q) => q.resolve(undefined));
        refreshQueue = [];
        // attach new token and retry original
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        // reject queued requests
        refreshQueue.forEach((q) => q.reject(refreshErr));
        refreshQueue = [];
        // optional: force logout by throwing special error
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

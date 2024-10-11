import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "./auth";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Make getAuthToken asynchronous
const getAuthToken = async (): Promise<string | undefined> => {
  const session = await getSession();
  return session?.token;
};

// Request interceptor to add auth token to requests
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  console.log("token", token);
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Function to make HTTP requests
export const httpClient = async <T>(
  method: string,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error("HTTP request failed");
    throw error;
  }
};

// Convenience methods
export const get = <T>(url: string, config?: AxiosRequestConfig) =>
  httpClient<T>("GET", url, undefined, config);

export const post = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) => httpClient<T>("POST", url, data, config);

export const put = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) => httpClient<T>("PUT", url, data, config);

export const del = <T>(url: string, config?: AxiosRequestConfig) =>
  httpClient<T>("DELETE", url, undefined, config);

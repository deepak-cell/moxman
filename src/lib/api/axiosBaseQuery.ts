import type { AxiosError, AxiosRequestConfig } from "axios";
import { apiClient } from "@/lib/api/client";

export type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
};

export const axiosBaseQuery =
  () =>
  async ({ url, method, data, params, headers }: AxiosBaseQueryArgs) => {
    try {
      const result = await apiClient.request({
        url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data ?? axiosError.message,
        },
      };
    }
  };

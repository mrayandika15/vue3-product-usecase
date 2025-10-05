import { ApiResponse } from "@/types/api";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add bearer token to all requests
        const token = import.meta.env.VITE_API_TOKEN;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(
          `Making ${config.method?.toUpperCase()} request to: ${config.url}`
        );
        return config;
      },
      (error: unknown) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(
          `Response received from: ${response.config.url}`,
          response.status
        );
        return response;
      },
      (error: unknown) => {
        console.error(
          "API Error:",
          (error as any).response?.data || (error as any).message
        );

        // Handle common error cases
        if ((error as any).response?.status === 401) {
          console.error("Unauthorized access - check your token");
        } else if ((error as any).response?.status === 403) {
          console.error("Forbidden access");
        } else if ((error as any).response?.status >= 500) {
          console.error("Server error occurred");
        }

        return Promise.reject(error);
      }
    );
  }

  // POST method only as requested
  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<ApiResponse<T>>(
        endpoint,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get the axios instance if needed for advanced usage
  getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

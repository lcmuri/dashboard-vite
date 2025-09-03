import axios, { AxiosError } from "axios";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import config from "@/config"; // Assuming this path is correct in your project

const { api } = config;

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: api.API_URL,
  headers: {
    post: {
      "Content-Type": "application/json",
    },
  },
});

// Initial token setup (consider dynamic updates after login/logout)
let initialToken: string | null = null;
try {
  const authUserString = sessionStorage.getItem("authUser");
  if (authUserString) {
    const parsedUser = JSON.parse(authUserString);
    if (parsedUser && typeof parsedUser.token === "string") {
      initialToken = parsedUser.token;
    }
  }
} catch (e) {
  console.error("Failed to parse authUser from sessionStorage:", e);
}

if (initialToken) {
  axiosInstance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${initialToken}`;
}

// Intercepting to capture errors
axiosInstance.interceptors.response.use(
  function (response: AxiosResponse) {
    // Return response.data directly as per your interceptor's original logic
    return response.data;
  },
  function (error: AxiosError) {
    // Explicitly type error as AxiosError
    let message: string;

    // Type guard to check if data has message property
    function hasMessage(data: any): data is { message: string } {
      return data && typeof data.message === "string";
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (error.response.status) {
        case 400:
          message = hasMessage(error.response.data)
            ? error.response.data.message
            : "Bad Request";
          break;
        case 401:
          message = hasMessage(error.response.data)
            ? error.response.data.message
            : "Invalid credentials or Unauthorized";
          // You might want to redirect to login here
          break;
        case 403:
          message = hasMessage(error.response.data)
            ? error.response.data.message
            : "Forbidden: You don't have permission to access this resource.";
          break;
        case 404:
          message = hasMessage(error.response.data)
            ? error.response.data.message
            : "Resource not found.";
          break;
        case 500:
          message = hasMessage(error.response.data)
            ? error.response.data.message
            : "Internal Server Error";
          break;
        default:
          message = hasMessage(error.response.data)
            ? error.response.data.message
            : `Error: ${error.response.status}`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an http.ClientRequest in node.js
      message =
        "No response received from server. Please check your network connection.";
    } else {
      // Something happened in setting up the request that triggered an Error
      message =
        error.message || "An unknown error occurred during request setup.";
    }
    return Promise.reject(message); // Reject with a string message
  }
);

/**
 * Sets the default authorization token for Axios instance.
 * @param token The JWT token string.
 */
const setAuthorization = (token: string) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

/**
 * Removes the default authorization token from Axios instance.
 */
const removeAuthorization = () => {
  delete axiosInstance.defaults.headers.common["Authorization"];
};

// Define a generic type for API responses data
type ApiResponse<T> = T; // Assuming your API returns the data directly after interceptor

class APIClient {
  /**
   * Fetches data from the given URL.
   * @param url The API endpoint URL.
   * @param params Optional query parameters.
   * @returns A Promise resolving to the fetched data.
   */
  get = <T = any>(
    url: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> => {
    return axiosInstance.get<T>(url, { params }) as Promise<T>; // Cast to Promise<T>
  };

  /**
   * Posts the given data to the URL.
   * @param url The API endpoint URL.
   * @param data The data payload to send.
   * @returns A Promise resolving to the created data.
   */
  create = <T = any>(url: string, data: any): Promise<ApiResponse<T>> => {
    return axiosInstance.post<T>(url, data) as Promise<T>; // Cast to Promise<T>
  };

  /**
   * Updates data using PATCH method.
   * @param url The API endpoint URL.
   * @param data The data payload to update.
   * @returns A Promise resolving to the updated data.
   */
  update = <T = any>(url: string, data: any): Promise<ApiResponse<T>> => {
    return axiosInstance.patch<T>(url, data) as Promise<T>; // Cast to Promise<T>
  };

  /**
   * Updates data using PUT method.
   * @param url The API endpoint URL.
   * @param data The data payload to update.
   * @returns A Promise resolving to the updated data.
   */
  put = <T = any>(url: string, data: any): Promise<ApiResponse<T>> => {
    return axiosInstance.put<T>(url, data) as Promise<T>; // Cast to Promise<T>
  };

  /**
   * Deletes data from the given URL.
   * @param url The API endpoint URL.
   * @param config Optional Axios request configuration.
   * @returns A Promise resolving to the deletion confirmation (or empty object).
   */
  delete = <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return axiosInstance.delete<T>(url, { ...config }) as Promise<T>; // Cast to Promise<T>
  };
}

interface LoggedInUser {
  token: string;
  // Add other properties of your user object here, e.g.,
  // userId: string;
  // username: string;
}

/**
 * Retrieves the logged-in user object from session storage.
 * @returns The parsed user object or null if not found or parsing fails.
 */
const getLoggedinUser = (): LoggedInUser | null => {
  const userString = sessionStorage.getItem("authUser");
  if (!userString) {
    return null;
  }
  try {
    const user: LoggedInUser = JSON.parse(userString);
    // Optional: Add more robust validation for 'user' properties here
    return user;
  } catch (e) {
    console.error("Error parsing authUser from sessionStorage:", e);
    return null;
  }
};

export { APIClient, setAuthorization, removeAuthorization, getLoggedinUser };

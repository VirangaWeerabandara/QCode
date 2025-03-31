const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const API_ROUTES = {
  LOGIN: `${API_BASE_URL}/user/login`,
  SIGNUP: `${API_BASE_URL}/user/signup`,
  // Add other API routes as needed
};

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const fetchApi = async <T,>(
  url: string,
  options: FetchOptions = {}
): Promise<T> => {
  // Default headers
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Merge default headers with any provided headers
  const headers: Record<string, string> = {
    ...defaultHeaders,
    ...options.headers,
  };

  // Get token from localStorage if it exists (for authorized requests)
  let token = null;
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    token = user ? JSON.parse(user).token : null;
  }

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    // Parse the response
    const data = isJson ? await response.json() : await response.text();

    // If the response is not ok, throw an error
    if (!response.ok) {
      const error =
        isJson && "error" in data ? data.error : "Something went wrong";
      throw new Error(error);
    }

    // Return the data
    return data as T;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

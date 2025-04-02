const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
// const API_BASE_URL = "https://qcode.altero.dev/api";

export const API_ROUTES = {
  LOGIN: `${API_BASE_URL}/user/login`,
  SIGNUP: `${API_BASE_URL}/user/signup`,

  // Quiz routes
  CREATE_QUIZ: `${API_BASE_URL}/quiz`,
  GET_QUIZZES: `${API_BASE_URL}/quiz`,
  GET_QUIZ: (id: string) => `${API_BASE_URL}/quiz/${id}`,
  UPDATE_QUIZ: (id: string) => `${API_BASE_URL}/quiz/${id}`,
  DELETE_QUIZ: (id: string) => `${API_BASE_URL}/quiz/${id}`,
  TOGGLE_QUIZ_STATUS: (id: string) =>
    `${API_BASE_URL}/quiz/${id}/toggle-status`,
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

// Quiz types
export interface Question {
  question: string;
  type: "multiple-choice" | "true-false" | "single-select";
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface Quiz {
  _id: string;
  quizId: string;
  title: string;
  description: string;
  questions: Question[];
  creator: string | { _id: string; name: string; email: string };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  qrCode?: string;
}

// Quiz API functions
export const quizApi = {
  // In the quizApi object
  createQuiz: async (quizData: {
    title: string;
    description: string;
    questions: Omit<Question, "_id">[];
  }) => {
    console.log("Sending quiz data to API:", JSON.stringify(quizData, null, 2));
    return fetchApi<Quiz>(API_ROUTES.CREATE_QUIZ, {
      method: "POST",
      body: JSON.stringify(quizData),
    });
  },

  getQuizzes: async () => {
    return fetchApi<Quiz[]>(API_ROUTES.GET_QUIZZES);
  },

  getQuiz: async (id: string) => {
    return fetchApi<Quiz>(API_ROUTES.GET_QUIZ(id));
  },

  updateQuiz: async (
    id: string,
    updates: Partial<{
      title: string;
      description: string;
      questions: Omit<Question, "_id">[];
      isActive: boolean;
    }>
  ) => {
    return fetchApi<Quiz>(API_ROUTES.UPDATE_QUIZ(id), {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  deleteQuiz: async (id: string) => {
    return fetchApi<{ message: string }>(API_ROUTES.DELETE_QUIZ(id), {
      method: "DELETE",
    });
  },

  toggleQuizStatus: async (id: string) => {
    return fetchApi<{ message: string; isActive: boolean }>(
      API_ROUTES.TOGGLE_QUIZ_STATUS(id),
      { method: "PATCH", body: JSON.stringify({}) }
    );
  },
};

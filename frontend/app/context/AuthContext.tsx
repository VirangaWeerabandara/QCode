"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface UserData {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextProps {
  user: UserData | null;
  login: (token: string, userData: UserData) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          id: userData._id || userData.id,
          email: userData.email,
          name: userData.name,
        });
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = (token: string, userData: UserData) => {
  // Store token in cookie
  Cookies.set("token", token, { expires: 3 }); 

  // Store the user data for client-side access
  const storedData = {
    token,
    _id: userData.id,
    id: userData.id,
    email: userData.email,
    name: userData.name,
  };

  // Save user in localStorage
  localStorage.setItem("user", JSON.stringify(storedData));

  // Set user state
  setUser(userData);
};

const logout = () => {
  // Remove user from localStorage
  localStorage.removeItem("user");

  // Remove token cookie
  Cookies.remove("token");

  // Attempt to clear HTTP-only cookie via API
  fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  }).catch((err) => {
    console.error("Error during logout:", err);
  });

  // Clear user state
  setUser(null);

  // Redirect to landing page instead of login
  router.push("/landing");
};

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

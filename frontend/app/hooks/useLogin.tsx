import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

interface LoginResponse {
    email: string;
    token: string;
    error?: string;
}

export const useLogin = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setIsLoading] = useState<boolean>(false);
    const { dispatch } = useAuthContext();

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:4000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const json: LoginResponse = await response.json();

            if (!response.ok) {
                setError(json.error || 'An error occurred');
                setIsLoading(false);
                return;
            }

            // save user in local storage
            localStorage.setItem('user', JSON.stringify(json));

            // update auth context
            dispatch({ type: 'LOGIN', payload: json });

            setIsLoading(false);
        } catch (err) {
            setError('Network error occurred');
            setIsLoading(false);
        }
    }

    return { login, loading, error };
}
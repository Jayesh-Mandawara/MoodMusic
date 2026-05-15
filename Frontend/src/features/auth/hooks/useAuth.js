import { login, register, getMe, logout } from "../services/auth.api";
import { use, useContext, useState } from "react";
import { AuthContext } from "../auth.context";
import { useEffect } from "react";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;
    const [error, setError] = useState(null);

    async function handleRegister({ username, email, password }) {
        try {
            setLoading(true);
            setError(null);
            const data = await register({ username, email, password });
            setUser(data.user);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
            throw err;
        }
    }

    async function handleLogin({ email, password }) {
        try {
            setLoading(true);
            setError(null);
            const data = await login({ email, password });
            setUser(data.user);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
            throw err;
        }
    }

    async function handleGetMe() {
        try {
            setLoading(true);
            setError(null);
            const data = await getMe();
            setUser(data.user);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    }

    async function handleLogout() {
        try {
            setLoading(true);
            setError(null);
            await logout();
            setUser(null);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetMe();
    }, []);

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
        user,
        loading,
        error,
    };
};

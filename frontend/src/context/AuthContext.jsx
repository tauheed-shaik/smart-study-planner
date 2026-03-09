import { createContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await api.get("/auth/me");
                setUser(res.data);
            } catch (error) {
                localStorage.removeItem("token");
                setUser(null);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post("/auth/login", {
                email,
                password,
            });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (error) {
            return { success: false, msg: error.response?.data?.msg || "Login failed" };
        }
    };

    const register = async (username, email, password) => {
        try {
            const res = await api.post("/auth/register", {
                username,
                email,
                password,
            });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (error) {
            return { success: false, msg: error.response?.data?.msg || "Signup failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser: checkUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

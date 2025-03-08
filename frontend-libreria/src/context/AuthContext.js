"use client";

import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                setUser(res.data);
                console.log("✅ Usuario cargado:", res.data); // 🔹 Verifica si se carga correctamente
            })
            .catch(() => logout());
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, { email, password });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            console.log("✅ Usuario autenticado:", res.data.user);
        } catch (error) {
            throw new Error("Credenciales incorrectas");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
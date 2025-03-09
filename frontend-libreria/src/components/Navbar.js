"use client";

import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import Link from "next/link";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
                📚 Libros Mágicos
            </Link>
            <Link href="/books" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                📚 Ver libros
            </Link>
            {user && (
                <Link href="/reservations" className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                    📖 Mis Reservas
                </Link>
            )}
            {user && user.role === "admin" && (
                <Link href="/admin" className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
                    🛠 Panel Admin
                </Link>
            )}
            <div>
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm">Bienvenido, {user.name}!</span>
                        <button
                            onClick={logout}
                            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                ) : (
                    <Link href="/login" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200">
                        Iniciar sesión
                    </Link>
                )}
            </div>
        </nav>
    );
}
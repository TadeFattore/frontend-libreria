"use client";

import { useEffect } from "react";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return null; // Evita renderizar contenido mientras se redirige
  }

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-black-100">
      <h1 className="text-4xl font-bold mb-6">📋 Panel de Administración</h1>
      <p className="text-lg mb-4">Selecciona una opción para gestionar:</p>
      <div className="flex gap-6">
        <Link href="/admin/books" className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition">
          📚 Gestionar Libros
        </Link>
        <Link href="/admin/users" className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition">
          👥 Gestionar Usuarios
        </Link>
      </div>
    </div>
  );
}
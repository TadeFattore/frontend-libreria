"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/library-background.jpg')" }}>
      <div className="bg-black bg-opacity-60 p-10 rounded-lg text-center text-white max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a Libros Mágicos</h1>
        <p className="text-lg mb-6">Explora y reserva tus libros favoritos desde la comodidad de tu hogar o visítanos en nuestras sucursales.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/books" className="bg-blue-500 px-6 py-3 rounded-md hover:bg-blue-600">📚 Ver Libros</Link>
          <Link href="/locales" className="bg-green-500 px-6 py-3 rounded-md hover:bg-green-600">📍 Nuestros Locales</Link>
        </div>
      </div>
    </div>
  );
}

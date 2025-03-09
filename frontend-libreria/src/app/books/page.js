"use client";

import { useState, useEffect, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";

export default function BooksPage() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const booksPerPage = 15;

  useEffect(() => {
    const fetchBooks = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/books?page=${page}&limit=15`);
            console.log("🔹 Respuesta completa de la API:", res.data); // Verifica toda la respuesta

            if (!res.data.books || !Array.isArray(res.data.books)) {
                console.error("❌ Error: `books` no es un array válido en la respuesta");
                setBooks([]); // Evita errores en el renderizado
                return;
            }

            setBooks(res.data.books);
            setTotalPages(res.data.totalPages || 1);
            console.log("✅ Estado actualizado - books:", res.data.books);
        } catch (error) {
            console.error("Error al obtener libros", error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };
    fetchBooks();
}, [page]);



  const handleReserve = async (id) => {
    if (!user) {
      alert("Debes iniciar sesión para reservar un libro");
      return;
    }

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}/reserve`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setBooks(books.map(book => book._id === id ? { ...book, available: false } : book));
      alert("Libro reservado exitosamente");
    } catch (error) {
      console.error("Error al reservar el libro", error);
      alert("No se pudo reservar el libro");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📚 Lista de Libros</h1>
      {loading ? (
        <p>Cargando libros...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {books.map(book => (
              <div key={book._id} className="border p-4 rounded-md shadow">
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p className="text-gray-600">{book.author}</p>
                <p className="text-sm italic">Género: {book.genre || "N/A"}</p>
                <p className={`text-sm font-bold ${book.available ? "text-green-600" : "text-red-600"}`}>
                  {book.available ? "Disponible" : "Reservado"}
                </p>
                {book.available && (
                  <button
                    onClick={() => handleReserve(book._id)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Reservar
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              className={`px-4 py-2 rounded-md ${page === 1 ? "bg-gray-500 text-black cursor-not-allowed" : "bg-gray-300 text-black hover:bg-gray-600"}`}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span className="text-lg">Página {page} de {totalPages}</span>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              className={`px-4 py-2 rounded-md ${page === totalPages ? "bg-gray-500 text-black cursor-not-allowed" : "bg-gray-300 text-black hover:bg-gray-600"}`}
              disabled={page === totalPages}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
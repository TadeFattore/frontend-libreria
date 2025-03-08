"use client";

import { useState, useEffect, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminBooksPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBook, setNewBook] = useState({ title: "", author: "", genre: "" });
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/admin"); // Redirige si no es admin
      return;
    }

    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/books`);
        setBooks(res.data);
      } catch (error) {
        console.error("Error al obtener libros", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user, router]);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/books`, newBook, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setBooks([...books, res.data]);
      setNewBook({ title: "", author: "", genre: "" });
      alert("Libro agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar el libro", error);
      alert("No se pudo agregar el libro");
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setBooks(books.filter(book => book._id !== id));
      alert("Libro eliminado");
    } catch (error) {
      console.error("Error al eliminar el libro", error);
      alert("No se pudo eliminar el libro");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📚 Gestión de Libros</h1>
      <form onSubmit={handleAddBook} className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Agregar Nuevo Libro</h2>
        <input type="text" placeholder="Título" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} className="w-full p-2 border rounded-md mb-2" required />
        <input type="text" placeholder="Autor" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} className="w-full p-2 border rounded-md mb-2" required />
        <input type="text" placeholder="Género" value={newBook.genre} onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })} className="w-full p-2 border rounded-md mb-2" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Agregar Libro</button>
      </form>
      <h2 className="text-xl font-semibold mb-2">Lista de Libros</h2>
      {loading ? <p>Cargando libros...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map(book => (
            <div key={book._id} className="border p-4 rounded-md shadow">
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>
              <p className="text-sm italic">Género: {book.genre || "N/A"}</p>
              <button onClick={() => handleDeleteBook(book._id)} className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Eliminar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
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
                console.log("🔹 Respuesta de la API:", res.data);
                setBooks(res.data.books || []);
            } catch (error) {
                console.error("❌ Error al obtener libros", error);
                setBooks([]);
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

    const handleEditClick = (book) => {
        setEditingBook(book);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">📚 Gestión de Libros</h1>

            {/* Formulario de Edición */}
            {editingBook && (
                <EditBookForm 
                    book={editingBook} 
                    setEditingBook={setEditingBook} 
                    setBooks={setBooks} 
                />
            )}

            {/* Formulario para agregar libros */}
            <form onSubmit={handleAddBook} className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Agregar Nuevo Libro</h2>
                <input type="text" placeholder="Título" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} className="w-full p-2 border rounded-md mb-2" required />
                <input type="text" placeholder="Autor" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} className="w-full p-2 border rounded-md mb-2" required />
                <input type="text" placeholder="Género" value={newBook.genre} onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })} className="w-full p-2 border rounded-md mb-2" />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Agregar Libro</button>
            </form>

            {/* Lista de libros */}
            <h2 className="text-xl font-semibold mb-2">Lista de Libros</h2>
            {loading ? <p>Cargando libros...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {books.map(book => (
                        <div key={book._id} className="border p-4 rounded-md shadow">
                            <h2 className="text-xl font-semibold">{book.title}</h2>
                            <p className="text-gray-600">{book.author}</p>
                            <p className="text-sm italic">Género: {book.genre || "N/A"}</p>
                            <button onClick={() => handleEditClick(book)} className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Editar</button>
                            <button onClick={() => handleDeleteBook(book._id)} className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Eliminar</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* -----------------------------------
   📌 COMPONENTE: FORMULARIO DE EDICIÓN 
----------------------------------- */
function EditBookForm({ book, setEditingBook, setBooks }) {
    const [formData, setFormData] = useState({
        title: book.title,
        author: book.author,
        genre: book.genre,
        available: book.available,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token"); // Obtener el token
            if (!token) {
                console.error("❌ No hay token en localStorage");
                alert("No tienes permiso para editar libros");
                return;
            }
    
            console.log("🔹 Enviando token:", token); // Debug para ver si el token existe
    
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/books/${book._id}`, 
                formData,
                {
                    headers: { 
                        "Authorization": `Bearer ${token}`, // Enviar el token en el header
                        "Content-Type": "application/json"
                    }
                }
            );
    
            console.log("✅ Libro actualizado:", res.data);
    
            // Actualizar la lista de libros en el frontend
            setBooks(prevBooks => prevBooks.map(b => (b._id === book._id ? res.data : b)));
            setEditingBook(null);
        } catch (error) {
            console.error("❌ Error al actualizar el libro:", error);
            alert(error.response?.data?.msg || "Error al actualizar el libro");
        }
    };

    return (
        <div className="bg-black p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold">Editar Libro</h2>
            <form onSubmit={handleSubmit} className="space-y-2">
                <input type="text" name="title" className="w-full p-2 border rounded-md"
                    value={formData.title} onChange={handleChange} required />
                <input type="text" name="author" className="w-full p-2 border rounded-md"
                    value={formData.author} onChange={handleChange} required />
                <input type="text" name="genre" className="w-full p-2 border rounded-md"
                    value={formData.genre} onChange={handleChange} required />
                <label className="block">
                    <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
                    Disponible
                </label>
                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                        Guardar cambios
                    </button>
                    <button type="button" className="bg-gray-400 text-white p-2 rounded-md"
                        onClick={() => setEditingBook(null)}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
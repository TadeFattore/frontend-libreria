"use client";

import { useState, useEffect, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ReservationsPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redirige si no está autenticado
      return;
    }

    const fetchReservations = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/reservations`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setReservations(res.data);
      } catch (error) {
        console.error("Error al obtener reservas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user, router]);

  const handleCancelReservation = async (id) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setReservations(reservations.filter(book => book._id !== id));
      alert("Reserva cancelada exitosamente");
    } catch (error) {
      console.error("Error al cancelar la reserva", error);
      alert("No se pudo cancelar la reserva");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📖 Mis Reservas</h1>
      {loading ? (
        <p>Cargando reservas...</p>
      ) : reservations.length === 0 ? (
        <p>No tienes reservas activas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reservations.map(book => (
            <div key={book._id} className="border p-4 rounded-md shadow">
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>
              <p className="text-sm italic">Género: {book.genre || "N/A"}</p>
              <p className="text-red-600 font-bold">Reservado</p>
              <button
                onClick={() => handleCancelReservation(book._id)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cancelar Reserva
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/admin"); // Redirige si no es admin
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Error al obtener usuarios", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, router]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsers([...users, res.data]);
      setNewUser({ name: "", email: "", password: "", role: "user" });
      alert("Usuario agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar usuario", error);
      alert("No se pudo agregar el usuario");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsers(users.filter(user => user._id !== id));
      alert("Usuario eliminado");
    } catch (error) {
      console.error("Error al eliminar usuario", error);
      alert("No se pudo eliminar el usuario");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">👥 Gestión de Usuarios</h1>
      <form onSubmit={handleAddUser} className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Agregar Nuevo Usuario</h2>
        <input type="text" placeholder="Nombre" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="w-full p-2 border rounded-md mb-2" required />
        <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="w-full p-2 border rounded-md mb-2" required />
        <input type="password" placeholder="Contraseña" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="w-full p-2 border rounded-md mb-2" required />
        <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full p-2 border rounded-md mb-2">
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Agregar Usuario</button>
      </form>
      <h2 className="text-xl font-semibold mb-2">Lista de Usuarios</h2>
      {loading ? <p>Cargando usuarios...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {users.map(user => (
            <div key={user._id} className="border p-4 rounded-md shadow">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm italic">Rol: {user.role}</p>
              <button onClick={() => handleDeleteUser(user._id)} className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Eliminar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
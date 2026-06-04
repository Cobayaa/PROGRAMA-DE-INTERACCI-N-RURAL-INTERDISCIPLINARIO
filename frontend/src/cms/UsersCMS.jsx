import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthApi } from "../Api/AuthApi";

const UsersCMS = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", email: "" });
    const { token } = useAuthApi();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error:", error);
            setMessage("Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    const activateUser = async (userId) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/activate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Usuario activado exitosamente");
            fetchUsers();
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Error al activar usuario");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const updateRole = async (userId, role) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/role`, { role }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Rol actualizado exitosamente");
            fetchUsers();
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Error al actualizar rol");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const deleteUser = async (userId) => {
        if (!confirm("¿Eliminar este usuario?")) return;
        
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Usuario eliminado exitosamente");
            fetchUsers();
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Error al eliminar usuario");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const startEdit = (user) => {
        setEditingUser(user._id);
        setEditForm({ name: user.name, email: user.email });
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setEditForm({ name: "", email: "" });
    };

    const saveEdit = async (userId) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Usuario actualizado exitosamente");
            fetchUsers();
            cancelEdit();
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Error al actualizar usuario");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Cargando usuarios...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
            
            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {message}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">Nombre</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Rol</th>
                            <th className="px-4 py-2 border">Estado</th>
                            <th className="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td className="px-4 py-2 border">
                                    {editingUser === user._id ? (
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full p-1 border rounded"
                                        />
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td className="px-4 py-2 border">
                                    {editingUser === user._id ? (
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            className="w-full p-1 border rounded"
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td className="px-4 py-2 border">
                                    <select 
                                        value={user.role}
                                        onChange={(e) => updateRole(user._id, e.target.value)}
                                        className="p-1 border rounded"
                                    >
                                        <option value="user">Usuario</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </td>
                                <td className="px-4 py-2 border">
                                    {user.isActivated ? (
                                        <span className="text-green-600 font-medium">Activado</span>
                                    ) : (
                                        <span className="text-red-600 font-medium">Pendiente</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 border">
                                    <div className="flex gap-2 flex-wrap">
                                        {!user.isActivated && (
                                            <button
                                                onClick={() => activateUser(user._id)}
                                                className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                                            >
                                                Activar
                                            </button>
                                        )}
                                        {editingUser === user._id ? (
                                            <>
                                                <button
                                                    onClick={() => saveEdit(user._id)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600"
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => startEdit(user)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                                            >
                                                Editar
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersCMS;
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthApi } from "../Api/AuthApi";
import FileUploader from "../components/FileUploader";

const NewsCMS = () => {
    const [news, setNews] = useState([]);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        summary: "",
        content: "",
        image: "",
        published: true,
        tags: []
    });
    const { token } = useAuthApi();

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/news/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNews(response.data);
        } catch (error) {
            console.error("Error:", error);
            setMessage("Error al cargar noticias");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTagsChange = (e) => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        setFormData(prev => ({ ...prev, tags }));
    };

    const resetForm = () => {
        setEditing(null);
        setShowForm(false);
        setFormData({
            title: "",
            summary: "",
            content: "",
            image: "",
            published: true,
            tags: []
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            const authToken = token || localStorage.getItem("token");
            
            if (!authToken) {
                setMessage("Error: No hay token de autenticación");
                setSaving(false);
                return;
            }
            if (editing) {
                await axios.put(`${import.meta.env.VITE_API_URL}/news/${editing}`, formData, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setMessage("Noticia actualizada correctamente");
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/news`, formData, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setMessage("Noticia creada correctamente");
            }
            resetForm();
            fetchNews();
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error al guardar la noticia";
            setMessage(errorMsg);
            setTimeout(() => setMessage(""), 5000);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setEditing(item._id);
        setFormData({
            title: item.title,
            summary: item.summary,
            content: item.content,
            image: item.image || "",
            published: item.published,
            tags: item.tags || []
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Eliminar esta noticia?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/news/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Noticia eliminada correctamente");
            fetchNews();
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Error al eliminar la noticia");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="text-center py-10">Cargando noticias...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Noticias</h1>
                <button
                    onClick={() => {
                        setEditing(null);
                        setFormData({
                            title: "",
                            summary: "",
                            content: "",
                            image: "",
                            published: true,
                            tags: []
                        });
                        setShowForm(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Nueva noticia
                </button>
            </div>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {message}
                </div>
            )}

            {showForm && (
                <div className="bg-white border rounded-lg p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            {editing ? "Editar noticia" : "Crear nueva noticia"}
                        </h2>
                        <button
                            onClick={resetForm}
                            className="text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ✕
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Título</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Resumen</label>
                            <textarea
                                name="summary"
                                rows={2}
                                value={formData.summary}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Contenido</label>
                            <textarea
                                name="content"
                                rows={8}
                                value={formData.content}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">Puedes usar HTML básico</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">URL de imagen</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                            <div className="mt-2">
                                <FileUploader
                                    onUploadComplete={(data) => {
                                        setFormData(prev => ({ ...prev, image: data.url }));
                                    }}
                                    onError={(error) => {
                                        setMessage(error);
                                        setTimeout(() => setMessage(""), 3000);
                                    }}
                                    accept="image/*"
                                />
                            </div>
                            {formData.image && (
                                <div className="mt-3">
                                    <img 
                                        src={formData.image} 
                                        alt="Vista previa"
                                        className="h-32 w-auto object-cover rounded-md border border-gray-200"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/200x120?text=Imagen+no+encontrada";
                                            e.target.onerror = null;
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tags (separados por coma)</label>
                            <input
                                type="text"
                                value={formData.tags.join(', ')}
                                onChange={handleTagsChange}
                                className="w-full p-2 border rounded"
                                placeholder="eventos, promociones, actividades"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="published"
                                    checked={formData.published}
                                    onChange={handleChange}
                                />
                                <span className="text-sm">Publicar inmediatamente</span>
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {saving ? "Guardando..." : (editing ? "Actualizar" : "Crear")}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border text-left">Título</th>
                            <th className="px-4 py-2 border text-left">Resumen</th>
                            <th className="px-4 py-2 border text-center">Fecha</th>
                            <th className="px-4 py-2 border text-center">Estado</th>
                            <th className="px-4 py-2 border text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {news.map(item => (
                            <tr key={item._id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border">{item.title}</td>
                                <td className="px-4 py-2 border max-w-xs">
                                    <p className="truncate">{item.summary}</p>
                                </td>
                                <td className="px-4 py-2 border text-center text-sm">
                                    {formatDate(item.createdAt)}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                    {item.published ? (
                                        <span className="text-green-600 text-sm">Publicado</span>
                                    ) : (
                                        <span className="text-gray-500 text-sm">Borrador</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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

export default NewsCMS;
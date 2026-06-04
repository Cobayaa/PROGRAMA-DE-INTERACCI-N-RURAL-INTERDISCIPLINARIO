import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthApi } from "../Api/AuthApi";

const ContentCMS = () => {
    const [pages, setPages] = useState({
        home: { title: "", subtitle: "", description: "", heroImage: "", sections: [] },
        whoweare: { title: "", subtitle: "", description: "", heroImage: "", sections: [] },
        about: { title: "", subtitle: "", description: "", heroImage: "", sections: [] },
        convenio: { title: "", subtitle: "", description: "", heroImage: "", sections: [] }
    });
    const [selectedPage, setSelectedPage] = useState("home");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const { token } = useAuthApi();

    useEffect(() => {
        fetchPageContent(selectedPage);
    }, [selectedPage]);

    const fetchPageContent = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/content/${page}`);
            setPages(prev => ({
                ...prev,
                [page]: {
                    title: response.data.title || "",
                    subtitle: response.data.subtitle || "",
                    description: response.data.description || "",
                    heroImage: response.data.heroImage || "",
                    sections: response.data.sections || []
                }
            }));
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setPages(prev => ({
            ...prev,
            [selectedPage]: {
                ...prev[selectedPage],
                [field]: value
            }
        }));
    };

    const handleSectionChange = (index, field, value) => {
        const newSections = [...pages[selectedPage].sections];
        newSections[index] = { ...newSections[index], [field]: value };
        setPages(prev => ({
            ...prev,
            [selectedPage]: {
                ...prev[selectedPage],
                sections: newSections
            }
        }));
    };

    const addSection = () => {
        const newSections = [...pages[selectedPage].sections, { title: "", content: "", image: "", order: pages[selectedPage].sections.length }];
        setPages(prev => ({
            ...prev,
            [selectedPage]: {
                ...prev[selectedPage],
                sections: newSections
            }
        }));
    };

    const removeSection = (index) => {
        const newSections = pages[selectedPage].sections.filter((_, i) => i !== index);
        setPages(prev => ({
            ...prev,
            [selectedPage]: {
                ...prev[selectedPage],
                sections: newSections
            }
        }));
    };

    const moveSectionUp = (index) => {
        if (index === 0) return;
        const newSections = [...pages[selectedPage].sections];
        [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
        setPages(prev => ({
            ...prev,
            [selectedPage]: {
                ...prev[selectedPage],
                sections: newSections
            }
        }));
    };

    const moveSectionDown = (index) => {
        if (index === pages[selectedPage].sections.length - 1) return;
        const newSections = [...pages[selectedPage].sections];
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        setPages(prev => ({
            ...prev,
            [selectedPage]: {
                ...prev[selectedPage],
                sections: newSections
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const authToken = token || localStorage.getItem("token");
            if (!authToken) {
                setMessage("No hay sesión activa");
                setSaving(false);
                return;
            }
            
            await axios.put(
                `${import.meta.env.VITE_API_URL}/content/${selectedPage}`,
                pages[selectedPage],
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            setMessage("Contenido guardado correctamente");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.message || error.message}`);
            setTimeout(() => setMessage(""), 5000);
        } finally {
            setSaving(false);
        }
    };

    const pageNames = {
        home: "Inicio",
        whoweare: "Quiénes Somos",
        about: "Acerca de",
        convenio: "Convenio"
    };

    if (loading) {
        return <div className="text-center py-10">Cargando contenido...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Editar Contenido</h1>
            
            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes("") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message}
                </div>
            )}

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Seleccionar página</label>
                <select 
                    value={selectedPage} 
                    onChange={(e) => setSelectedPage(e.target.value)}
                    className="w-full md:w-64 p-2 border rounded"
                >
                    {Object.entries(pageNames).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                    ))}
                </select>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Configuración general</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Título</label>
                            <input
                                type="text"
                                value={pages[selectedPage]?.title || ""}
                                onChange={(e) => handleChange("title", e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Título principal de la página"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Subtítulo</label>
                            <input
                                type="text"
                                value={pages[selectedPage]?.subtitle || ""}
                                onChange={(e) => handleChange("subtitle", e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Subtítulo debajo del título"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Descripción general</label>
                            <textarea
                                rows={4}
                                value={pages[selectedPage]?.description || ""}
                                onChange={(e) => handleChange("description", e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Descripción general que aparece antes de las secciones..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Esta descripción aparece entre el hero y las secciones.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">URL imagen principal (hero)</label>
                            <input
                                type="text"
                                value={pages[selectedPage]?.heroImage || ""}
                                onChange={(e) => handleChange("heroImage", e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                            {pages[selectedPage]?.heroImage && (
                                <img 
                                    src={pages[selectedPage].heroImage} 
                                    alt="Vista previa"
                                    className="mt-2 h-24 object-cover rounded"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Secciones dinámicas */}
                <div className="border p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Secciones</h2>
                        <button
                            type="button"
                            onClick={addSection}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                            + Agregar sección
                        </button>
                    </div>
                    
                    {pages[selectedPage]?.sections?.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No hay secciones. Agrega una.</p>
                    )}
                    
                    {pages[selectedPage]?.sections?.map((section, index) => (
                        <div key={index} className="border-t pt-4 mt-4 first:border-t-0 first:pt-0">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">Sección {index + 1}</h3>
                                <div className="flex gap-2">
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => moveSectionUp(index)}
                                            className="text-gray-500 hover:text-gray-700 text-sm"
                                            title="Mover arriba"
                                        >
                                            ↑
                                        </button>
                                    )}
                                    {index < pages[selectedPage].sections.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={() => moveSectionDown(index)}
                                            className="text-gray-500 hover:text-gray-700 text-sm"
                                            title="Mover abajo"
                                        >
                                            ↓
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeSection(index)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Título de la sección (ej: Misión, Visión, Valores)"
                                    value={section.title || ""}
                                    onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                                <textarea
                                    rows={6}
                                    placeholder="Contenido de la sección. Puedes usar HTML básico: &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;"
                                    value={section.content || ""}
                                    onChange={(e) => handleSectionChange(index, "content", e.target.value)}
                                    className="w-full p-2 border rounded font-mono text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="URL de imagen (opcional)"
                                    value={section.image || ""}
                                    onChange={(e) => handleSectionChange(index, "image", e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                                {section.image && (
                                    <img 
                                        src={section.image} 
                                        alt="Vista previa"
                                        className="h-20 object-cover rounded"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
            </form>
        </div>
    );
};

export default ContentCMS;
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthApi } from "../Api/AuthApi";
import FileUploader from "../components/FileUploader";


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
    const [activeModule, setActiveModule] = useState("general");
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
        setActiveModule("sections");
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
                setMessage({ type: "error", text: "No hay sesión activa" });
                setSaving(false);
                return;
            }
            
            await axios.put(
                `${import.meta.env.VITE_API_URL}/content/${selectedPage}`,
                pages[selectedPage],
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            setMessage({ type: "success", text: "Contenido guardado correctamente" });
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage({ type: "error", text: `Error: ${error.response?.data?.message || error.message}` });
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
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
                    <p className="text-gray-600">Cargando contenido...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Gestor de Contenidos</h1>
                    <p className="text-sm text-gray-500 mt-1">Administra el contenido de las páginas institucionales</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Mensaje de notificación */}
                {message && (
                    <div className={`mb-6 p-4 rounded-md ${
                        message.type === "success" 
                            ? "bg-green-50 border border-green-200 text-green-800" 
                            : "bg-red-50 border border-red-200 text-red-800"
                    }`}>
                        <div className="flex items-center">
                            <span className="text-sm">{message.text}</span>
                        </div>
                    </div>
                )}

                {/* Barra superior de navegación */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Página</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(pageNames).map(([key, name]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => {
                                        setSelectedPage(key);
                                        setActiveModule("general");
                                    }}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                        selectedPage === key
                                            ? "bg-gray-900 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Módulos - Navegación secundaria */}
                    <div className="px-6 py-3 bg-gray-50 flex gap-4">
                        <button
                            type="button"
                            onClick={() => setActiveModule("general")}
                            className={`text-sm font-medium transition-colors ${
                                activeModule === "general"
                                    ? "text-gray-900 border-b-2 border-gray-900 pb-2"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Información General
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveModule("hero")}
                            className={`text-sm font-medium transition-colors ${
                                activeModule === "hero"
                                    ? "text-gray-900 border-b-2 border-gray-900 pb-2"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Imagen Principal
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveModule("sections")}
                            className={`text-sm font-medium transition-colors ${
                                activeModule === "sections"
                                    ? "text-gray-900 border-b-2 border-gray-900 pb-2"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Secciones ({pages[selectedPage]?.sections?.length || 0})
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Módulo: Información General */}
                    {activeModule === "general" && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-medium text-gray-900">Información General</h2>
                                <p className="text-sm text-gray-500 mt-1">Configuración básica de la página</p>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Título de la página
                                    </label>
                                    <input
                                        type="text"
                                        value={pages[selectedPage]?.title || ""}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                                        placeholder="Ej: Bienvenidos a la Universidad"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subtítulo
                                    </label>
                                    <input
                                        type="text"
                                        value={pages[selectedPage]?.subtitle || ""}
                                        onChange={(e) => handleChange("subtitle", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                                        placeholder="Ej: Excelencia académica con compromiso social"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción general
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={pages[selectedPage]?.description || ""}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-y"
                                        placeholder="Descripción institucional que aparece después de la imagen principal..."
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Esta descripción aparece entre la imagen hero y las secciones de contenido.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeModule === "hero" && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-medium text-gray-900">Imagen Principal</h2>
                                <p className="text-sm text-gray-500 mt-1">Imagen destacada (Hero) de la página</p>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        URL de la imagen
                                    </label>
                                    <input
                                        type="text"
                                        value={pages[selectedPage]?.heroImage || ""}
                                        onChange={(e) => handleChange("heroImage", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-mono text-sm"
                                        placeholder="https://ejemplo.com/banner-principal.jpg"
                                    />
                                    <div className="mt-2">
                                        <FileUploader
                                            onUploadComplete={(data) => {
                                                handleChange("heroImage", data.url);
                                            }}
                                            onError={(error) => {
                                                setMessage({ type: "error", text: error });
                                                setTimeout(() => setMessage(""), 3000);
                                            }}
                                            accept="image/*,video/*"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Recomendación: usar imágenes en formato JPG o PNG, tamaño 1920x1080px</p>
                                </div>
                                {pages[selectedPage]?.heroImage && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Vista previa</label>
                                        <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                                            <img 
                                                src={pages[selectedPage].heroImage} 
                                                alt="Vista previa"
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/800x300?text=Imagen+no+encontrada";
                                                    e.target.onerror = null;
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeModule === "sections" && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">Secciones de contenido</h2>
                                    <p className="text-sm text-gray-500 mt-1">Organiza el contenido en bloques modulares</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addSection}
                                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                                >
                                    + Nueva sección
                                </button>
                            </div>
                            
                            <div className="p-6">
                                {pages[selectedPage]?.sections?.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 mb-2">
                                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">No hay secciones creadas</p>
                                        <p className="text-sm text-gray-400 mt-1">Comienza agregando tu primera sección</p>
                                    </div>
                                )}
                                
                                <div className="space-y-4">
                                    {pages[selectedPage]?.sections?.map((section, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                            {/* Cabecera de la sección */}
                                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                                                    <h3 className="font-medium text-gray-900">
                                                        {section.title || "Sección sin título"}
                                                    </h3>
                                                </div>
                                                <div className="flex gap-2">
                                                    {index > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => moveSectionUp(index)}
                                                            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                                                            title="Mover arriba"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    {index < pages[selectedPage].sections.length - 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => moveSectionDown(index)}
                                                            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                                                            title="Mover abajo"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSection(index)}
                                                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Contenido de la sección */}
                                            <div className="p-4 space-y-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Título de la sección</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Ej: Misión, Visión, Valores"
                                                        value={section.title || ""}
                                                        onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Contenido</label>
                                                    <textarea
                                                        rows={5}
                                                        placeholder="Escribe el contenido de la sección. Puedes usar formato HTML básico: &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;"
                                                        value={section.content || ""}
                                                        onChange={(e) => handleSectionChange(index, "content", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-mono text-sm resize-y"
                                                    />
                                                </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Imagen o Video</label>
                                                        <input
                                                            type="text"
                                                            placeholder="https://ejemplo.com/archivo.jpg o .mp4"
                                                            value={section.image || ""}
                                                            onChange={(e) => handleSectionChange(index, "image", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm font-mono"
                                                        />
                                                        <div className="mt-2">
                                                            <FileUploader
                                                                onUploadComplete={(data) => {
                                                                    handleSectionChange(index, "image", data.url);
                                                                }}
                                                                onError={(error) => {
                                                                    setMessage({ type: "error", text: error });
                                                                    setTimeout(() => setMessage(""), 3000);
                                                                }}
                                                                accept="image/*,video/*"
                                                            />
                                                        </div>
                                                        {section.image && (
                                                            <div className="mt-3">
                                                                {section.image.match(/\.(mp4|webm|mov)$/i) ? (
                                                                    <video 
                                                                        src={section.image} 
                                                                        className="h-32 w-auto object-cover rounded-md border border-gray-200"
                                                                        controls
                                                                    />
                                                                ) : (
                                                                    <img 
                                                                        src={section.image} 
                                                                        alt="Vista previa"
                                                                        className="h-32 w-auto object-cover rounded-md border border-gray-200"
                                                                        onError={(e) => {
                                                                            e.target.src = "https://via.placeholder.com/200x120?text=Imagen+no+encontrada";
                                                                            e.target.onerror = null;
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Botón de guardado */}
                    <div className="sticky bottom-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    {saving ? "Guardando cambios..." : "Listo para guardar"}
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {saving ? "Guardando..." : "Publicar cambios"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContentCMS;
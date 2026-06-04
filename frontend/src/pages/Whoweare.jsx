import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

const Whoweare = () => {
    const [content, setContent] = useState({
        title: "",
        subtitle: "",
        description: "",
        heroImage: "",
        sections: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/content/whoweare`);
            setContent(response.data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-pulse text-gray-400">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="bg-white font-Raleway">
            {/* Hero Section con overlay */}
            {content.heroImage && (
                <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
                    <img 
                        src={content.heroImage} 
                        alt={content.title || "Quiénes Somos"}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center text-white px-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-4">
                                {content.title || "Quiénes Somos"}
                            </h1>
                            {content.subtitle && (
                                <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
                                    {content.subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Si no hay heroImage, mostrar título normal */}
            {!content.heroImage && (
                <div className="text-center pt-16 pb-8 px-4">
                    <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4">
                        {content.title || "Quiénes Somos"}
                    </h1>
                    {content.subtitle && (
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {content.subtitle}
                        </p>
                    )}
                </div>
            )}

            {content.description && (
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div 
                        className="text-center text-gray-700 text-lg leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: content.description }}
                    />
                </div>
            )}

            {content.sections && content.sections.length > 0 ? (
                <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
                    {content.sections.length === 1 ? (
                        <div className="max-w-4xl mx-auto">
                            {content.sections.map((section, idx) => (
                                <div key={idx} className="text-center">
                                    {section.image && (
                                        <img 
                                            src={section.image} 
                                            alt={section.title}
                                            className="w-full max-w-2xl mx-auto h-64 md:h-80 object-cover rounded-xl shadow-lg mb-8"
                                        />
                                    )}
                                    <h2 className="text-3xl md:text-4xl font-normal text-gray-800 mb-6">
                                        {section.title}
                                    </h2>
                                    <div 
                                        className="text-gray-700 text-base md:text-lg leading-relaxed space-y-4 text-left max-w-3xl mx-auto"
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : content.sections.length === 2 ? (
                        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                            {content.sections.map((section, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                                    {section.image && (
                                        <img 
                                            src={section.image} 
                                            alt={section.title}
                                            className="w-full h-48 object-cover rounded-lg mb-6"
                                        />
                                    )}
                                    <h2 className="text-2xl md:text-3xl font-normal text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                        {section.title}
                                    </h2>
                                    <div 
                                        className="text-gray-600 text-base leading-relaxed space-y-4"
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {content.sections.map((section, idx) => (
                                <div key={idx} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    {section.image && (
                                        <img 
                                            src={section.image} 
                                            alt={section.title}
                                            className="w-full h-40 object-cover rounded-lg mb-4"
                                        />
                                    )}
                                    <h2 className="text-xl md:text-2xl font-normal text-gray-800 mb-3">
                                        {section.title}
                                    </h2>
                                    <div 
                                        className="text-gray-600 text-sm leading-relaxed space-y-3"
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-400">
                    {/* que esea por secciones y mejorar el ui/ux- falta permitir agregar video y demás además de las nuevas secciones y... */}
                </div>
            )}
        </div>
    );
};

export default Whoweare;
import { useState, useEffect } from "react";
import axios from "axios";

const Convenio = () => {
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
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/content/convenio`);
            setContent(response.data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="animate-pulse">
                    <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
                    <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            {content.heroImage && (
                <div className="relative h-96 overflow-hidden">
                    <img 
                        src={content.heroImage} 
                        alt={content.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center text-white px-6 max-w-4xl">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                {content.title}
                            </h1>
                            {content.subtitle && (
                                <p className="text-lg md:text-xl">
                                    {content.subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!content.heroImage && (
                <div className="py-16 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {content.title}
                        </h1>
                        {content.subtitle && (
                            <p className="text-lg text-gray-600">
                                {content.subtitle}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-6 py-16">
                {content.description && (
                    <div className="mb-16">
                        <div 
                            className="text-gray-700 text-lg leading-relaxed text-center"
                            dangerouslySetInnerHTML={{ __html: content.description }}
                        />
                    </div>
                )}

                {content.sections && content.sections.length > 0 && (
                    <div className="space-y-16">
                        {content.sections.map((section, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row gap-10 items-start">
                                {section.image && idx % 2 === 0 && (
                                    <div className="md:w-2/5">
                                        <img 
                                            src={section.image} 
                                            alt={section.title}
                                            className="w-full h-64 object-cover rounded-lg shadow-sm"
                                        />
                                    </div>
                                )}
                                
                                <div className={section.image ? "md:w-3/5" : "w-full"}>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        {section.title}
                                    </h2>
                                    <div 
                                        className="text-gray-600 leading-relaxed space-y-3"
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                </div>

                                {section.image && idx % 2 === 1 && (
                                    <div className="md:w-2/5">
                                        <img 
                                            src={section.image} 
                                            alt={section.title}
                                            className="w-full h-64 object-cover rounded-lg shadow-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Convenio;
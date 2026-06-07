import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, ChevronRight } from "lucide-react";

const News = () => {
    const [news, setNews] = useState([]);
    const [selectedNews, setSelectedNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const newsPerPage = 5;

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/news`);
            setNews(response.data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
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

    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);
    const totalPages = Math.ceil(news.length / newsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <div className="h-8 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="flex gap-4 p-4 border-b border-gray-100">
                            <div className="w-24 h-24 bg-gray-200 rounded"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                                <div className="h-4 w-full bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (selectedNews) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-10">
                <button
                    onClick={() => setSelectedNews(null)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8"
                >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Volver a noticias
                </button>
                <article>
                    {selectedNews.image && (
                        <img
                            src={selectedNews.image}
                            alt={selectedNews.title}
                            className="w-full h-80 object-cover pointer-events-none rounded-lg mb-6"
                        />
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {selectedNews.title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-500 text-sm pb-6 mb-6 border-b">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(selectedNews.publishedAt || selectedNews.createdAt)}</span>
                        </div>
                        {selectedNews.author?.name && (
                            <span>Por {selectedNews.author.name}</span>
                        )}
                    </div>
                    <div className="text-gray-700 leading-relaxed space-y-4">
                        <div dangerouslySetInnerHTML={{ __html: selectedNews.content }} />
                    </div>
                </article>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Noticias</h1>
                <span className="text-sm text-gray-500">{news.length} publicaciones</span>
            </div>

            {news.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-400">No hay noticias disponibles</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3 mb-10">
                        {currentNews.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => setSelectedNews(item)}
                                className="flex gap-5 p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer border border-transparent hover:border-gray-200"
                            >
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                                    />
                                )}
                                <div className="flex-1">
                                    <div className="mb-2 text-xs text-gray-400">
                                        <span>{formatDate(item.publishedAt || item.createdAt)}</span>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                        {item.title}
                                    </h2>
                                    <p className="text-sm text-gray-500 line-clamp-1">
                                        {item.summary || item.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 self-center" />
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-6 border-t">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            
                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => paginate(number)}
                                        className={`w-8 h-8 text-sm rounded ${
                                            currentPage === number
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default News;
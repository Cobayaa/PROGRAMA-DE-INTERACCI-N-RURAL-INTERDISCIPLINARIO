import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthApi } from "../Api/AuthApi.js";

const ContactCMS = () => {
    const [contactInfo, setContactInfo] = useState({
        address: { street: "", city: "", country: "" },
        phone: "",
        email: "",
        schedule: { days: "", hours: "" },
        socialMedia: { facebook: "", instagram: "", twitter: "" },
        mapUrl: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { token } = useAuthApi();

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/contact`);
            const data = response.data;
            
            setContactInfo({
                address: {
                    street: data.address?.street || "",
                    city: data.address?.city || "",
                    country: data.address?.country || ""
                },
                phone: data.phone || "",
                email: data.email || "",
                schedule: {
                    days: data.schedule?.days || "",
                    hours: data.schedule?.hours || ""
                },
                socialMedia: {
                    facebook: data.socialMedia?.facebook || "",
                    instagram: data.socialMedia?.instagram || "",
                    twitter: data.socialMedia?.twitter || ""
                },
                mapUrl: data.mapUrl || ""
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleChange = (e, section, field) => {
        if (section) {
            setContactInfo(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: e.target.value
                }
            }));
        } else {
            setContactInfo(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const authToken = token || localStorage.getItem("token");
            
            if (!authToken) {
                setMessage("No hay sesión activa");
                setLoading(false);
                return;
            }
            
            await axios.put(`${import.meta.env.VITE_API_URL}/contact`, contactInfo, {
                headers: { 
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            setMessage("Información actualizada correctamente");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Error detallado:", error.response?.data);
            setMessage(error.response?.data?.message || "Error al actualizar");
            setTimeout(() => setMessage(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Editar Información de Contacto</h1>
            
            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes("Error") || message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border p-4 rounded">
                    <h2 className="text-xl font-semibold mb-4">Dirección</h2>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Calle"
                            value={contactInfo.address.street}
                            onChange={(e) => handleChange(e, "address", "street")}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Ciudad"
                            value={contactInfo.address.city}
                            onChange={(e) => handleChange(e, "address", "city")}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="País"
                            value={contactInfo.address.country}
                            onChange={(e) => handleChange(e, "address", "country")}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="border p-4 rounded">
                    <h2 className="text-xl font-semibold mb-4">Contacto</h2>
                    <div className="space-y-3">
                        <input
                            type="text"
                            name="phone"
                            placeholder="Teléfono"
                            value={contactInfo.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={contactInfo.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="border p-4 rounded">
                    <h2 className="text-xl font-semibold mb-4">Horario</h2>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Días"
                            value={contactInfo.schedule.days}
                            onChange={(e) => handleChange(e, "schedule", "days")}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Horas"
                            value={contactInfo.schedule.hours}
                            onChange={(e) => handleChange(e, "schedule", "hours")}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="border p-4 rounded">
                    <h2 className="text-xl font-semibold mb-4">Redes Sociales</h2>
                    <div className="space-y-3">
                        <input
                            type="url"
                            placeholder="Facebook URL"
                            value={contactInfo.socialMedia.facebook}
                            onChange={(e) => handleChange(e, "socialMedia", "facebook")}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="url"
                            placeholder="Instagram URL"
                            value={contactInfo.socialMedia.instagram}
                            onChange={(e) => handleChange(e, "socialMedia", "instagram")}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="url"
                            placeholder="Twitter URL"
                            value={contactInfo.socialMedia.twitter}
                            onChange={(e) => handleChange(e, "socialMedia", "twitter")}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
            </form>
        </div>
    );
};

export default ContactCMS;
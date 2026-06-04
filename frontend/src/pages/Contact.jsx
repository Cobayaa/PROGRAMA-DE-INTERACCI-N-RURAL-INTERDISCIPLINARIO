import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

const Contact = () => {
    const [contactInfo, setContactInfo] = useState({
        address: { street: "", city: "", country: "" },
        phone: "",
        email: "",
        schedule: { days: "", hours: "" }
    });
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/contact`);
            setContactInfo(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Validar el formulario
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = "El nombre es obligatorio";
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "El nombre debe tener al menos 3 caracteres";
        }
        
        if (!formData.email.trim()) {
            newErrors.email = "El correo es obligatorio";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Ingresa un correo válido";
        }
        
        if (formData.phone && !/^[\d\s+\-\(\)]{8,}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = "Ingresa un teléfono válido (mínimo 8 dígitos)";
        }
        
        if (!formData.message.trim()) {
            newErrors.message = "El mensaje es obligatorio";
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "El mensaje debe tener al menos 10 caracteres";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ""
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/contact/send-message`, formData);
            setSubmitted(true);
            setFormData({ name: "", email: "", phone: "", message: "" });
            setErrors({});
            setTimeout(() => setSubmitted(false), 3000);
        } catch (error) {
            alert(error.response?.data?.message || "Error al enviar mensaje. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white justify-center pt-10 align-center font-Raleway">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-normal text-gray-900 tracking-wide">Contacto</h1>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-xl font-medium text-gray-800 mb-6">Envíanos un mensaje</h2>
                        
                        {submitted && (
                            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                                ¡Mensaje enviado! Te contactaremos pronto.
                            </div>
                        )}
                        
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <input 
                                    type="text" 
                                    name="name"
                                    placeholder="Nombre completo *"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-gray-500 bg-white rounded`}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>
                            
                            <div>
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="Correo electrónico *"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-gray-500 bg-white rounded`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                            
                            <div>
                                <input 
                                    type="tel" 
                                    name="phone"
                                    placeholder="Teléfono (opcional)"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-gray-500 bg-white rounded`}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>
                            
                            <div>
                                <textarea 
                                    name="message"
                                    rows={5}
                                    placeholder="Mensaje *"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-gray-500 bg-white rounded`}
                                ></textarea>
                                {errors.message && (
                                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                                )}
                            </div>
                            
                            <button 
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-gray-800 text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Enviando..." : "Enviar"}
                            </button>
                        </form>
                    </div>

                    <div>
                        <h2 className="text-xl font-medium text-gray-800 mb-6">Información de contacto</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Dirección</h3>
                                <p className="text-gray-800">
                                    {contactInfo.address.street || "Calle Principal"}<br />
                                    {contactInfo.address.city || "Ciudad"}, {contactInfo.address.country || "País"}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Teléfono</h3>
                                <p className="text-gray-800">{contactInfo.phone || "+57 123 456 7890"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Correo electrónico</h3>
                                <p className="text-gray-800">{contactInfo.email || "info@ejemplo.com"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Horario de atención</h3>
                                <p className="text-gray-800">
                                    {contactInfo.schedule?.days || "Lunes a Viernes"}<br />
                                    {contactInfo.schedule?.hours || "8:00 AM - 5:00 PM"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
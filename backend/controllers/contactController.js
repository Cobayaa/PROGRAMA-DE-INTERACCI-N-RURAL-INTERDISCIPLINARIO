import ContactInfo from "../models/ContactInfo.js";
import nodemailer from "nodemailer";

export const getContactInfo = async (req, res) => {
    try {
        const info = await ContactInfo.getInfo();
        
        const formattedInfo = {
            address: {
                street: info.address?.street || "",
                city: info.address?.city || "",
                country: info.address?.country || ""
            },
            phone: info.phone || "",
            email: info.email || "",
            schedule: {
                days: info.schedule?.days || "",
                hours: info.schedule?.hours || ""
            },
            socialMedia: {
                facebook: info.socialMedia?.facebook || "",
                instagram: info.socialMedia?.instagram || "",
                twitter: info.socialMedia?.twitter || ""
            },
            mapUrl: info.mapUrl || ""
        };
        
        res.json(formattedInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateContactInfo = async (req, res) => {
    try {
        const info = await ContactInfo.getInfo();
        const updated = await ContactInfo.findByIdAndUpdate(
            info._id,
            { ...req.body, updatedAt: Date.now() },
            { returnDocument: 'after' }
        );
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const sendContactMessage = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        
        console.log("Mensaje recibido:", { name, email, phone, message });
        
        res.json({ 
            success: true, 
            message: "Mensaje enviado correctamente. Te contactaremos pronto." 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
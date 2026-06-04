import ContactInfo from "../models/ContactInfo.js";
import nodemailer from "nodemailer";

export const getContactInfo = async (req, res) => {
    try {
        const info = await ContactInfo.getInfo();
        res.json(info);
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
            { new: true }
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
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }
        const user = await User.create({
            email,
            password,
            name,
            role: 'user',
            isActivated: false,
        });
        res.status(201).json({
            success: true,
            message: "Usuario registrado. Espera a que un administrador active tu cuenta.",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isActivated: user.isActivated,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        
        if (!user.isActivated) {
            return res.status(401).json({ 
                message: "Cuenta no activada. Contacta al administrador." 
            });
        }
        
        const token = generateToken(user._id);
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isActivated: user.isActivated,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verify = async (req, res) => {
    try {
        const user = req.user;
        
        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isActivated: user.isActivated,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ success: true, message: "Sesión cerrada" });
};
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token;
    
    if (req.cookies?.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return res.status(401).json({ message: "No autorizado - Token no proporcionado" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }
        
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "No autorizado - Token inválido" });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Acceso denegado - Se requieren permisos de administrador" });
    }
};
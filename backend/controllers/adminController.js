import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const activateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { isActivated: true },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        res.json({ 
            success: true, 
            user, 
            message: "Usuario activado exitosamente" 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: "Rol inválido" });
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { role },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        res.json({ 
            success: true, 
            user, 
            message: "Rol actualizado exitosamente" 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
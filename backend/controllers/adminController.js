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

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);

        if(!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json({ 
            success: true, 
            message: "Usuario eliminado exitosamente" 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserData = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findById(req.user._id);

        if (!user){
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;

        const updatedUser = await user.save();

        const userWithoutPassword = updatedUser.toObject();
        delete userWithoutPassword.password;

        res.json({ success: true, user: updatedUser });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};
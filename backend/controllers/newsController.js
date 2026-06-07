import News from "../models/News.js";

export const getAllNews = async (req, res) => {
    try {
        const news = await News.find({ published: true })
            .sort({ publishedAt: -1 })
            .populate('author', 'name');
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllNewsAdmin = async (req, res) => {
    try {
        const news = await News.find()
            .sort({ createdAt: -1 })
            .populate('author', 'name');
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id).populate('author', 'name');
        if (!news) {
            return res.status(404).json({ message: "Noticia no encontrada" });
        }
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createNews = async (req, res) => {
    try {
        const news = await News.create({
            ...req.body,
            author: req.user._id
        });
        
        res.status(201).json({ success: true, data: news });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateNews = async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!news) {
            return res.status(404).json({ message: "Noticia no encontrada" });
        }
        res.json({ success: true, data: news });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteNews = async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) {
            return res.status(404).json({ message: "Noticia no encontrada" });
        }
        res.json({ success: true, message: "Noticia eliminada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
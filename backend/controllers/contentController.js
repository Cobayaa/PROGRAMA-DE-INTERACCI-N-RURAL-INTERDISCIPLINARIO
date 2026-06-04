import PageContent from "../models/PageContent.js";

export const getPageContent = async (req, res) => {
    try {
        const { page } = req.params;
        
        const validPages = ['home', 'whoweare', 'about', 'convenio'];
        if (!validPages.includes(page)) {
            return res.status(400).json({ message: "Página no válida" });
        }
        
        const content = await PageContent.getOrCreate(page);
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllPagesContent = async (req, res) => {
    try {
        const pages = await PageContent.find().populate('updatedBy', 'name');
        res.json(pages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePageContent = async (req, res) => {
    try {
        const { page } = req.params;
        const { title, subtitle, description, heroImage, sections, seo } = req.body;
        
        const validPages = ['home', 'whoweare', 'about', 'convenio'];
        if (!validPages.includes(page)) {
            return res.status(400).json({ message: "Página no válida" });
        }
        
        const pageContent = await PageContent.getOrCreate(page);
        
        if (title !== undefined) pageContent.title = title;
        if (subtitle !== undefined) pageContent.subtitle = subtitle;
        if (description !== undefined) pageContent.description = description;
        if (heroImage !== undefined) pageContent.heroImage = heroImage;
        if (sections !== undefined) pageContent.sections = sections;
        if (seo !== undefined) pageContent.seo = seo;
        
        pageContent.updatedAt = Date.now();
        pageContent.updatedBy = req.user._id;
        
        await pageContent.save();
        
        res.json({ 
            success: true, 
            data: pageContent,
            message: "Contenido actualizado correctamente"
        });
    } catch (error) {
        console.error("Error en updatePageContent:", error);
        res.status(500).json({ message: error.message });
    }
};
import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 }
});

const pageContentSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
        unique: true,
        enum: ['home', 'whoweare', 'about', 'convenio']
    },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    sections: [sectionSchema],
    seo: {
        metaTitle: { type: String, default: "" },
        metaDescription: { type: String, default: "" },
        metaKeywords: { type: String, default: "" }
    },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

pageContentSchema.statics.getOrCreate = async function(page) {
    let content = await this.findOne({ page });
    if (!content) {
        content = await this.create({ page });
    }
    return content;
};

const PageContent = mongoose.model('PageContent', pageContentSchema);
export default PageContent;
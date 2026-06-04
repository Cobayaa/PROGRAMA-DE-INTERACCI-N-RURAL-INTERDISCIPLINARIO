import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema({
    address: {
        street: { type: String, },
        city: { type: String, },
        country: { type: String, },
    },
    phone: { type: String, },
    email: { type: String, },
    schedule: {
        days: { type: String, },
        hours: { type: String, },
    },
    socialMedia: {
        facebook: { type: String, default: "" },
        instagram: { type: String, default: "" },
        twitter: { type: String, default: "" },
    },
    mapUrl: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now },
});

contactInfoSchema.statics.getInfo = async function() {
    let info = await this.findOne();
    if (!info) {
        info = await this.create({});
    }
    return info;
};

const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);
export default ContactInfo;
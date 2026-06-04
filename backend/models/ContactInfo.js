import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema({
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        country: { type: String, default: "" }
    },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    schedule: {
        days: { type: String, default: "" },
        hours: { type: String, default: "" }
    },
    socialMedia: {
        facebook: { type: String, default: "" },
        instagram: { type: String, default: "" },
        twitter: { type: String, default: "" }
    },
    mapUrl: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now }
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
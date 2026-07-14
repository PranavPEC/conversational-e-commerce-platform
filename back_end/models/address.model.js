import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    label: {
        type: String,
        enum: ["Home", "Work", "Other"],
        default: "Home"
    },

    fullName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    line1: {
        type: String,
        required: true
    },

    line2: {
        type: String
    },

    city: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    pincode: {
        type: String,
        required: true
    },

    // Only one address per user should ever have this set to true —
    // enforced in the controller, not the schema (Mongoose can't easily
    // express "unique among this user's documents" as a schema-level rule).
    isDefault: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);
export default Address;
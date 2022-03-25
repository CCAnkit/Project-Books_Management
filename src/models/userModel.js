const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLen: [8, "Password length should not be less than 8"],
        maxLen: [15, "Password length should not be greater than 15"]
    },
    address: {
        street: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        pincode: {
            type: String,
            trim: true,
        }
    },
}, { timestamps: true })




module.exports = mongoose.model("UserDetail", userSchema);
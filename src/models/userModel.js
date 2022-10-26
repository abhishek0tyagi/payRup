const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        enum: ["Mr", "Mrs","Miss"],
        trim:true
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim:true
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        trim:true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim:true
    },
    address: {
        street: {
            type: String,
            trim:true
        },
        city: {
            type: String,
            trim:true
        },
        pincode: {
            type: String,
            length: 6,
            trim:true
        }
    },

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
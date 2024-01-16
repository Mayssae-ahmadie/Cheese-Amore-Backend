const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true, unique: true },
    city: { type: String },
    fullAddress: {
        street: { type: String },
        building: { type: String },
        floor: { type: String },
        description: { type: String },
    },
    role: {
        type: String,
        enum: ["admin", "client"], required: true, default: 'client'
    },
    firebaseUid: { type: String },
},
    { timestamps: true });

const User = mongoose.model('users', userSchema);

module.exports = User;
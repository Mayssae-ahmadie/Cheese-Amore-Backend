const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    dateTime: { type: Date, required: true },
    selection: [
        { type: String }
    ],
    eventLocation: { type: String, required: true },
    type: { type: String, required: true },
    guestNumber: { type: Number, required: true }
});

const Request = mongoose.model('requests', requestSchema);

module.exports = Request;
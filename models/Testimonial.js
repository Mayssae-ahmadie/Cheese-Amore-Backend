const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    review: { type: String, required: true },
    userImage: { type: String, required: true },
    approve: { type: Boolean, default: false },

});

const Testimonial = mongoose.model('testimonials', testimonialSchema);

module.exports = Testimonial;
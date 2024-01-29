const Testimonial = require('../models/Testimonial');
const User = require('../models/User');

const getAllTestimonials = async (req, res) => {
    try {
        const testimonial = await Testimonial.find({});
        res.status(200).json({
            success: true,
            message: 'Data retrieved successfully',
            data: testimonial,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Unable to get data',
            error: error.message,
        });
    }
};

// const getTestimonialByID = async (req, res) => {
//     try {
//         const testimonial = await Testimonial.findById(req.params.ID);

//         if (!testimonial) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Testimonial not found',
//             });
//         }
//         res.status(200).json({
//             success: true,
//             message: 'Data retrieved successfully',
//             data: testimonial,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Unable to get data by ID',
//             error: error.message,
//         });
//     }
// };

// const getTestimonialByFullName = async (req, res) => {
//     try {
//         const { selectedReview, selectedFullName } = req.body;

//         const testimonial = new Testimonial({
//             review: selectedReview,
//             userId: { fullName: selectedFullName },
//         });

//         await testimonial.save();

//         res.status(200).json({
//             success: true,
//             message: 'Testimonial added successfully',
//             data: testimonial,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Unable to add testimonial',
//             error: error.message,
//         });
//     }
// };

const getTestimonialByID = async (req, res) => {
    try {
        // Retrieve the testimonial by its ID
        const testimonial = await Testimonial.findById(req.params.ID);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found',
            });
        }

        // Extract the user ID associated with the testimonial
        const userId = testimonial.userId;

        // Fetch the corresponding user from the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found for this testimonial',
            });
        }

        // Extract the full name from the user object
        const fullName = user.fullName;

        // Return the testimonial data along with the user's full name
        res.status(200).json({
            success: true,
            message: 'Testimonial retrieved successfully',
            data: {
                testimonial: testimonial,
                userFullName: fullName,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to get data by ID',
            error: error.message,
        });
    }
};

const addTestimonial = async (req, res) => {
    const { userId, review } = req.body;
    try {
        const testimonial = new Testimonial({
            userId,
            review,
            approve: false,
        });
        await testimonial.save();

        res.status(200).json({
            success: true,
            message: 'Data added successfully',
            data: testimonial,
        });
        console.log(userId, "id")
        console.log(review, "rev")
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: 'Unable to add data',
            error: error.message,
        });
    }
};

const deleteTestimonialByID = async (req, res) => {
    try {
        const testimonial = await Testimonial.deleteOne({ _id: req.params.ID });
        res.status(200).json({
            success: true,
            message: 'Data deleted successfully',
            data: testimonial,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Unable to delete data',
            error: error.message,
        });
    }
};

const updateTestimonialByID = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.ID, req.body);
        res.status(200).json({
            success: true,
            message: 'Data updated successfully.',
            data: testimonial,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Unable to update data',
            error: error.message,
        });
    }
};

module.exports = {
    getAllTestimonials,
    getTestimonialByID,
    // getTestimonialByFullName,
    addTestimonial,
    updateTestimonialByID,
    deleteTestimonialByID,
};
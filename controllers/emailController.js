const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
    try {
        const { email, message } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Subject of the email',
            text: message,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Email sent successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to send email',
            error: error.message,
        });
    }
};

module.exports = {
    sendEmail,
};
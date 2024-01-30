require('dotenv').config();
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Product = require('../models/Product');

const sendOrderConfirmationEmailToClient = async (Order) => {
    try {
        const transporter = nodemailer.createTransport({

            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });


        const user = await User.findById(Order.userId);

        const productDetails = Order.productIds.map(product => `
            <div>
               
                <p>Name: ${product.name}</p>
                <img src="${product.image}" alt="${product.name}" style="max-width: 100px;"/>
                <p>Price: ${product.price}</p>
            </div>
        `).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Order Confirmation',
            html: `
                <p>Thank you for your order!</p>
            
                <p>User Details:</p>
                <p>Name: ${User.fullName}</p>
                <p>Email: ${User.email}</p>
              
               
                <p>Product Details:</p>
                ${productDetails}
                <p>Total Price: ${Order.totalPrice}</p>
                <p>Shipping Method: ${Order.shippingMethod}</p>
                <p>Shipping Fee: ${Order.shippingFee}</p>
                <p>Date and time : ${Order.receiveDateTime}</p>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email to client:', error);
    }
};

const sendOrderNotificationEmailToOwner = async (Order) => {

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const user = await User.findById(Order.userId);

        const productDetails = Order.productIds.map(product => `
            <div>
                <p>Product ID: ${product._id}</p>
                <p>Name: ${product.name}</p>
                <img src="${product.image}" alt="${product.name}" style="max-width: 100px;"/>
                <p>Price: ${product.price}</p>
            </div>
        `).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_ADMIN,
            subject: 'New Order Notification',
            html: `
                <p>You have received a new order!</p>
                <p>Order ID: ${Order._id}</p>
                <p>User Details:</p>
                <p>Name: ${User.fullName}</p>
                <p>Email: ${User.email}</p>
                <p>Address: ${User.fullAddress}</p>
                <p>Phone Number: ${user.phoneNumber}</p>
                <p>Product Details:</p>
                ${productDetails}
                <p>Product ID: ${Order.productIds}</p>
                <p>Total Price: ${Order.totalPrice}</p>
                <p>Shipping Method: ${Order.shippingMethod}</p>
                <p>Shipping Fee: ${Order.shippingFee}</p>
                <p>Date and Time: ${Order.receiveDateTime}</p>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email to website owner:', error);
    }
};

module.exports = { sendOrderNotificationEmailToOwner, sendOrderConfirmationEmailToClient };
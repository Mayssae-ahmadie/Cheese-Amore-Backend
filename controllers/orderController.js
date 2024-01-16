const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { sendOrderNotificationEmailToOwner, sendOrderConfirmationEmailToClient } = require('../extra/sendEmails')

const createOrderFromCart = async (req, res) => {
    try {
        const { cartID } = req.params;
        const { shippingMethod } = req.body;

        const cart = await Cart.findById(cartID).populate('productIds');

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: `No cart found with id ${cartID}`,
            });
        }

        if (cart.productIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot checkout with an empty cart',
            });
        }

        const defaultShippingMethod = 'delivery';
        const selectedShippingMethod = shippingMethod || defaultShippingMethod;

        const order = new Order({
            userId: cart.userId,
            productIds: cart.productIds,
            totalPrice: cart.totalPrice + (selectedShippingMethod === 'delivery' ? 10 : 0),
            status: 'pending',
            shippingMethod: selectedShippingMethod,
            shippingFee: selectedShippingMethod === 'delivery' ? 10 : 0,
            paymentMethod: 'cash on delivery',
        });

        await order.save();

        cart.productIds = [];
        cart.totalPrice = 0;
        await cart.save();

        await sendOrderConfirmationEmailToClient(order);
        await sendOrderNotificationEmailToOwner(order);

        res.status(200).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to create order from cart",
            error: error.message,
        });
    }
};

const deleteById = async (req, res) => {
    try {
        const { orderID } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(orderID);

        if (deletedOrder) {
            res.status(200).json({
                success: true,
                message: `Order with ID ${orderID} deleted successfully`,
            });
        } else {
            res.status(404).json({
                success: false,
                message: `Order with ID ${orderID} not found`,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to delete order",
            error: error.message,
        });
    }
};

const updateById = async (req, res) => {
    try {
        const { orderID } = req.params;
        const { status } = req.body;

        const updatedFields = {};

        if (status) updatedFields.status = status;


        const updatedOrder = await Order.findByIdAndUpdate(orderID, updatedFields, { new: true });

        if (updatedOrder) {
            res.status(200).json({
                success: true,
                message: `Order with ID ${orderID} updated successfully`,
                data: updatedOrder,
            });
        } else {
            res.status(404).json({
                success: false,
                message: `Order with ID ${orderID} not found`,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to update order',
            error: error.message,
        });
    }
};

const getById = async (req, res) => {
    try {
        const { orderID } = req.params;
        const order = await Order.findById(orderID);

        if (order) {
            res.status(200).json({
                success: true,
                message: `Order with ID ${orderID} retrieved successfully`,
                data: order,
            });
        } else {
            res.status(404).json({
                success: false,
                message: `Order with ID ${orderID} not found`,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to get order',
            error: error.message,
        });
    }
};

const getAll = async (_, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).json({
            success: true,
            message: `Orders' data retrieved successfully`,
            data: orders,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: `Unable to get orders' data`,
            error: error,
        });
    }
};

const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId: userId });

        if (orders.length > 0) {
            res.status(200).json({
                success: true,
                message: `Orders for user with ID ${userId} retrieved successfully`,
                data: orders,
            });
        } else {
            res.status(404).json({
                success: false,
                message: `No orders found for user with ID ${userId}`,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Unable to get orders for the user with ID ${userID}`,
            error: error.message,
        });
    }
};

module.exports = {
    createOrderFromCart,
    deleteById,
    updateById,
    getById,
    getAll,
    getOrdersByUser,
}
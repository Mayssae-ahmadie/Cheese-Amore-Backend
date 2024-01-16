const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');

const createCart = async (req, res) => {
    try {
        const { userID } = req.body;

        const userExists = await User.findById(userID);

        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: `User with id ${userID} isn't registered`,
            });
        }

        const newCart = new Cart({
            userId: userID,
            productIds: [],
        });

        await newCart.save();

        res.status(200).json({
            success: true,
            message: 'Cart created successfully',
            data: newCart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to create cart',
            error: error.message,
        });
    }
};

const getCartByUserID = async (req, res) => {
    try {
        const user = await User.findById(req.params.userID);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `No cart for the user with id ${req.params.userID}`,
            });
        }

        const cart = await Cart.findOne({ userId: req.params.userID }).populate(
            "productIds"
        );

        res.status(200).json({
            success: true,
            message: "Data retrieved successfully",
            data: {
                user: user,
                cart: {
                    productIds: cart.productIds.map(item => ({
                        productId: item.productId._id,
                        quantity: item.quantity,
                        instruction: item.instruction,
                    })),
                },
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to get cart by user ID",
            error: error.message,
        });
    }
};

const addProductToCart = async (req, res) => {
    try {
        const { productID, quantity, instruction } = req.body;

        const productExists = await Product.findById(productID);

        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: `No product with id ${productID} available`,
            });
        }

        const cart = await Cart.findOne({ _id: req.params.cartID });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: `No cart with id ${req.params.cartID} available`,
            });
        }

        if (cart.productIds.includes(productID)) {
            return res.status(401).json({
                success: false,
                message: `${productExists.name} already exists in your cart`,
            });
        }

        const existingProductIndex = cart.productIds.findIndex(item => item.productId.equals(productID));

        if (existingProductIndex !== -1) {
            // If the product is already in the cart, update the quantity
            cart.productIds[existingProductIndex].quantity = quantity;

            if (quantity === 0) {
                // If the quantity becomes 0, remove the product from the cart
                cart.productIds.splice(existingProductIndex, 1);
            }
        } else {
            // If the product is not in the cart, add it
            cart.productIds.push({
                productId: productID,
                quantity: quantity,
                instruction: instruction
            });
        }
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Product added to cart successfully',
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to add product to cart',
            error: error.message,
        });
    }
};

const removeProductFromCart = async (req, res) => {
    try {
        const { productID } = req.body;

        const cart = await Cart.findOne({ _id: req.params.cartID });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: `No cart with id ${req.params.cartID} available`,
            });
        }

        const productExists = await Product.findById(productID);

        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: `No product with id ${productID} available`,
            });
        }

        if (!cart.productIds.includes(productID)) {
            return res.status(401).json({
                success: false,
                message: `Product with id ${productID} not found in your cart`,
            });
        }

        const index = cart.productIds.indexOf(productID);
        if (index !== -1) {
            cart.productIds.splice(index, 1);
            await cart.save();
        }

        res.status(200).json({
            success: true,
            message: 'Product removed from cart successfully',
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to remove product from cart',
            error: error.message,
        });
    }
};

module.exports = {
    createCart,
    getCartByUserID,
    addProductToCart,
    removeProductFromCart,
};
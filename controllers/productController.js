const Product = require("../models/Product");
const { FileUpload } = require("../extra/imageUploader");

const add = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            serving,
        } = req.body;

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !serving
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const file = await FileUpload(req.file);
        const img = file.downloadURL;

        if (!img) {
            return res.status(400).json({
                success: false,
                message: "Image file is required",
            });
        }

        const newProduct = new Product({
            name,
            image: img,
            description,
            price,
            category,
            serving,
        });

        await newProduct.save();
        console.log(newProduct);
        res.status(200).json({
            success: true,
            message: "Product data added successfully",
            data: newProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to add product data",
            error: error.message,
        });
    }
};

const getAll = async (_, res) => {
    try {
        const products = await Product.find({});
        if (!products) {
            return res.status(404).json({
                success: false,
                message: `Product not found`,
            })
        };

        res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            data: products,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to get all products",
            error: error.message,
        });
    }
};

const getByID = async (req, res) => {
    try {
        const product = await Product.findById(req.params.ID);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Product with ID ${req.params.ID} not found`,
            });
        }
        res.status(200).json({
            success: true,
            message: "Product data retrieved successfully",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to get product data by ID",
            error: error.message,
        });
    }
};

const deleteById = async (req, res) => {
    try {
        const product = await Product.deleteOne({ _id: req.params.ID });

        if (product.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: `No product found with ID ${req.params.ID}`,
            });
        }

        res.status(200).json({
            success: true,
            message: `Product with ID ${req.params.ID} deleted successfully`,
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to delete product data",
            error: error.message,
        });
    }
};

const update = async (req, res) => {
    const { ID } = req.params;
    const { name, description, price, catergory, serving, image } = req.body;

    try {
        let file;
        let imageLink;
        if (req.file) {
            file = await FileUpload(req.file);
            imageLink = file.downloadURL;
        }
        imageLink = image
        const Updates = {
            name, image: imageLink, description, price, catergory, serving
        };
        const existingProduct = await Product.findByIdAndUpdate(ID, Updates);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const updatedProduct = await existingProduct.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to update product",
            error: error.message,
        });
    }
};

const getAllByCategory = async (req, res) => {
    try {
        const products = await Product.find({
            category: req.params.category,
        });

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No products found for the category ${req.params.category}`,
            });
        }

        res.status(200).json({
            success: true,
            message: "Products retrieved by category successfully",
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to get products by category",
            error: error,
        });
    }
};

module.exports = {
    getAll,
    getByID,
    add,
    update,
    deleteById,
    getAllByCategory,
};
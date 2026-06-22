import Product from "../models/user.product.js";
import uploadOnCloudinary from "../config/cloudinary.js";

// Create Product  (Admin Only)
export const createProduct = async (req, res) => {
    try {
        const { title, description, price, stock } = req.body;

        if (!title || !description || !price || !stock) {
            return res.status(400).json({
                message: "Please provide all required fields: title, description, price, stock."
            });
        }

        if (price < 0 || stock < 0) {
            return res.status(400).json({
                message: "Price and stock cannot be negative."
            });
        }

        // Upload image to Cloudinary if provided
        // uploadOnCloudinary reads from file path, uploads, deletes temp file, returns URL
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        const newProduct = await Product.create({
            title,
            description,
            price: Number(price),   // req.body values from FormData come as strings — convert
            stock: Number(stock),
            image
        });

        // SOCKET.IO HOOK (Step 15):
        // io.emit("product:created", newProduct);

        return res.status(201).json({
            message: "Product Created Successfully.",
            product: newProduct
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Get All Products  (Public)
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ message: "Products Fetched Successfully.", products });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Get Single Product By ID  (Public)
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product Not Found." });
        }
        return res.status(200).json({ message: "Product Fetched Successfully.", product });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Update Product  (Admin Only)
export const updateProduct = async (req, res) => {
    try {
        const { title, description, price, stock } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product Not Found." });
        }

        if (price !== undefined && Number(price) < 0) {
            return res.status(400).json({ message: "Price cannot be negative." });
        }
        if (stock !== undefined && Number(stock) < 0) {
            return res.status(400).json({ message: "Stock cannot be negative." });
        }

        // Only update fields that were actually sent
        if (title)       product.title       = title;
        if (description) product.description = description;
        if (price)       product.price       = Number(price);   // FormData sends strings
        if (stock !== undefined) product.stock = Number(stock);

        // If a new image was uploaded, replace the old one
        if (req.file) {
            product.image = await uploadOnCloudinary(req.file.path);
        }

        await product.save();

        // SOCKET.IO HOOK (Step 15):
        // io.emit("product:updated", product);

        return res.status(200).json({
            message: "Product Updated Successfully.",
            product
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Delete Product  (Admin Only)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product Not Found." });
        }

        // SOCKET.IO HOOK (Step 15):
        // io.emit("product:deleted", { productId: req.params.id });

        return res.status(200).json({ message: "Product Deleted Successfully." });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};
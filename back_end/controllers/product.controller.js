import Product, { PRODUCT_CATEGORIES } from "../models/user.product.js";
import uploadOnCloudinary from "../config/cloudinary.js";

// ── Parse and normalize a categories value from FormData ──
// FormData sends arrays as JSON strings (Admin.jsx stringifies before appending).
// Falls back gracefully to a plain string for legacy callers.
const parseCategories = (raw) => {
    if (!raw) return null
    let arr
    try {
        arr = JSON.parse(raw)               // expect JSON array string from frontend
    } catch {
        arr = [raw]                         // legacy fallback: treat as single value
    }
    if (!Array.isArray(arr)) arr = [arr]
    return arr.map(c => String(c).trim().toLowerCase()).filter(Boolean)
}

// Create Product  (Admin Only)
export const createProduct = async (req, res) => {
    try {
        const { title, description, price, stock, category } = req.body;

        if (!title || !description || !price || !stock || !category) {
            return res.status(400).json({
                message: "Please provide all required fields: title, description, price, stock, category."
            });
        }

        const categories = parseCategories(category)
        if (!categories || categories.length === 0) {
            return res.status(400).json({ message: "At least one category is required." })
        }
        const invalidCategory = categories.find(c => !PRODUCT_CATEGORIES.includes(c))
        if (invalidCategory) {
            return res.status(400).json({ message: `Invalid category: ${invalidCategory}` })
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
            category: categories,
            image
        });

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
        const category = req.query.category?.toLowerCase()
        const search = req.query.search?.trim()

        const queryConditions = []
        if (category) {
            // category is now an array field — $in matches any product whose
            // category array CONTAINS the requested category string
            queryConditions.push({ category: { $in: [category] } })
        }

        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            const searchRegex = new RegExp(escapedSearch, "i")

            queryConditions.push({
                $or: [
                    { title: searchRegex },
                    { description: searchRegex },
                    { category: searchRegex },   // regex on array field checks any element
                ],
            })
        }

        let query = {}
        if (queryConditions.length === 1) {
            query = queryConditions[0]
        } else if (queryConditions.length > 1) {
            query = { $and: queryConditions }
        }

        const products = await Product.find(query)
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
        const { title, description, price, stock, category } = req.body;

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

        if (category !== undefined) {
            const categories = parseCategories(category)
            if (!categories || categories.length === 0) {
                return res.status(400).json({ message: "At least one category is required." })
            }
            const invalidCategory = categories.find(c => !PRODUCT_CATEGORIES.includes(c))
            if (invalidCategory) {
                return res.status(400).json({ message: `Invalid category: ${invalidCategory}` })
            }
            product.category = categories
        }

        // Only update fields that were actually sent
        if (title)       product.title       = title;
        if (description) product.description = description;
        if (price !== undefined) product.price = Number(price);   // FormData sends strings
        if (stock !== undefined) product.stock = Number(stock);

        // If a new image was uploaded, replace the old one
        if (req.file) {
            product.image = await uploadOnCloudinary(req.file.path);
        }

        await product.save();

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

        return res.status(200).json({ message: "Product Deleted Successfully." });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};

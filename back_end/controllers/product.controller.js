import Product, { PRODUCT_CATEGORIES } from "../models/user.product.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

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
            return sendError(res, 400, "Please provide all required fields: title, description, price, stock, category.");
        }

        const categories = parseCategories(category)
        if (!categories || categories.length === 0) {
            return sendError(res, 400, "At least one category is required.")
        }
        const invalidCategory = categories.find(c => !PRODUCT_CATEGORIES.includes(c))
        if (invalidCategory) {
            return sendError(res, 400, `Invalid category: ${invalidCategory}`)
        }

        if (price < 0 || stock < 0) {
            return sendError(res, 400, "Price and stock cannot be negative.");
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

        return sendSuccess(res, 201, "Product Created Successfully.", { product: newProduct });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
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
        return sendSuccess(res, 200, "Products Fetched Successfully.", { products });
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


// Get Single Product By ID  (Public)
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return sendError(res, 404, "Product Not Found.");
        }
        return sendSuccess(res, 200, "Product Fetched Successfully.", { product });
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


// Update Product  (Admin Only)
export const updateProduct = async (req, res) => {
    try {
        const { title, description, price, stock, category } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return sendError(res, 404, "Product Not Found.");
        }

        if (price !== undefined && Number(price) < 0) {
            return sendError(res, 400, "Price cannot be negative.");
        }
        if (stock !== undefined && Number(stock) < 0) {
            return sendError(res, 400, "Stock cannot be negative.");
        }

        if (category !== undefined) {
            const categories = parseCategories(category)
            if (!categories || categories.length === 0) {
                return sendError(res, 400, "At least one category is required.")
            }
            const invalidCategory = categories.find(c => !PRODUCT_CATEGORIES.includes(c))
            if (invalidCategory) {
                return sendError(res, 400, `Invalid category: ${invalidCategory}`)
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

        return sendSuccess(res, 200, "Product Updated Successfully.", { product });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


// Delete Product  (Admin Only)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return sendError(res, 404, "Product Not Found.");
        }

        return sendSuccess(res, 200, "Product Deleted Successfully.");

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};

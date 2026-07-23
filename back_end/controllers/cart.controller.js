import Cart from "../models/user.cart.js";
import Product from "../models/user.product.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// Add Product To Cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 1) {
            return sendError(res, 400, "Please provide valid productId and quantity.");
        }

        const product = await Product.findById(productId);

        if (!product) {
            return sendError(res, 404, "Product Not Found.");
        }

        if (quantity > product.stock) {
            return sendError(res, 400, `Only ${product.stock} items available in stock.`);
        }

        let cart = await Cart.findOne({ user: userId });

        // Create Cart First Time
        if (!cart) {
            cart = await Cart.create({
                user: userId,
                products: [
                    {
                        product: productId,
                        quantity
                    }
                ]
            });

            return sendSuccess(res, 201, "Product Added To Cart.", { cart });
        }

        // Product Already Exists In Cart
        const existingProduct = cart.products.find(
            item => item.product.toString() === productId
        );

        if (existingProduct) {

            const newQuantity = existingProduct.quantity + quantity;

            if (newQuantity > product.stock) {
                return sendError(res, 400, `Only ${product.stock} items available in stock.`);
            }

            existingProduct.quantity = newQuantity;
        }
        else {
            cart.products.push({
                product: productId,
                quantity
            });
        }

        await cart.save();

        return sendSuccess(res, 200, "Cart Updated Successfully.", { cart });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};



// Get User Cart
export const getCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.userId
        }).populate("products.product");

        if (!cart) {
            return sendSuccess(res, 200, "Cart Fetched Successfully.", { cart: { products: [] } });
        }

        return sendSuccess(res, 200, "Cart Fetched Successfully.", { cart });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};



// Update Quantity
export const updateCartItem = async (req, res) => {
    try {

        const { productId, quantity } = req.body;

        if (!quantity || quantity < 1) {
            return sendError(res, 400, "Quantity must be greater than 0.");
        }

        const cart = await Cart.findOne({
            user: req.userId
        });

        if (!cart) {
            return sendError(res, 404, "Cart Not Found.");
        }

        const cartProduct = cart.products.find(
            item => item.product.toString() === productId
        );

        if (!cartProduct) {
            return sendError(res, 404, "Product Not Found In Cart.");
        }

        const product = await Product.findById(productId);

        if (!product) {
            return sendError(res, 404, "Product Not Found.");
        }

        if (quantity > product.stock) {
            return sendError(res, 400, `Only ${product.stock} items available in stock.`);
        }

        cartProduct.quantity = quantity;

        await cart.save();

        return sendSuccess(res, 200, "Cart Updated Successfully.", { cart });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};



// Remove Product From Cart
export const removeCartItem = async (req, res) => {
    try {

        const { productId } = req.params;

        const cart = await Cart.findOne({
            user: req.userId
        });

        if (!cart) {
            return sendError(res, 404, "Cart Not Found.");
        }

        cart.products = cart.products.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        return sendSuccess(res, 200, "Product Removed Successfully.", { cart });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};



// Clear Cart
export const clearCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.userId
        });

        if (!cart) {
            return sendError(res, 404, "Cart Not Found.");
        }

        cart.products = [];

        await cart.save();

        return sendSuccess(res, 200, "Cart Cleared Successfully.");

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};
import Cart from "../models/user.cart.js";
import Product from "../models/user.product.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import Coupon from "../models/coupon.model.js";
import { calculateCartPricing } from "../utils/cartPricing.js";

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
        const cart = await Cart.findOne({ user: req.userId }).populate("products.product");

        if (!cart) {
            return sendSuccess(res, 200, "Cart Fetched Successfully.", {
                cart: { products: [] },
                pricing: { subtotal: 0, discountAmount: 0, total: 0, couponCode: null },
            });
        }

        const pricing = await calculateCartPricing(cart);

        let couponRemoved = null;
        if (pricing.couponRemovedReason && cart.appliedCoupon) {
            cart.appliedCoupon = null;
            await cart.save();
            couponRemoved = pricing.couponRemovedReason;
        }

        return sendSuccess(res, 200, "Cart Fetched Successfully.", {
            cart,
            pricing: {
                subtotal: pricing.subtotal,
                discountAmount: pricing.discountAmount,
                total: pricing.total,
                couponCode: pricing.appliedCoupon?.code || null,
            },
            couponRemoved,
        });

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

export const applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        if (typeof code !== "string" || !code.trim()) {
            return sendError(res, 400, "Please provide a valid coupon code.");
        }

        const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
        if (!coupon) return sendError(res, 404, "Invalid coupon code.");

        const cart = await Cart.findOne({ user: req.userId }).populate("products.product");
        if (!cart || cart.products.length === 0) return sendError(res, 400, "Your cart is empty.");

        cart.appliedCoupon = coupon._id;
        const pricing = await calculateCartPricing(cart);

        if (pricing.couponRemovedReason) {
            cart.appliedCoupon = null;
            await cart.save();
            return sendError(res, 400, pricing.couponRemovedReason);
        }

        await cart.save();

        return sendSuccess(res, 200, "Coupon applied successfully.", {
            subtotal: pricing.subtotal,
            discountAmount: pricing.discountAmount,
            total: pricing.total,
            couponCode: coupon.code,
        });
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};

export const removeCoupon = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.userId });
        if (!cart) return sendError(res, 404, "Cart Not Found.");

        cart.appliedCoupon = null;
        await cart.save();

        return sendSuccess(res, 200, "Coupon removed.");
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};
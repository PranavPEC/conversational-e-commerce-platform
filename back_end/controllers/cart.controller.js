import Cart from "../models/user.cart.js";
import Product from "../models/user.product.js";

// Add Product To Cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                message: "Please provide valid productId and quantity."
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product Not Found."
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: `Only ${product.stock} items available in stock.`
            });
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

            return res.status(201).json({
                message: "Product Added To Cart.",
                cart
            });
        }

        // Product Already Exists In Cart
        const existingProduct = cart.products.find(
            item => item.product.toString() === productId
        );

        if (existingProduct) {

            const newQuantity = existingProduct.quantity + quantity;

            if (newQuantity > product.stock) {
                return res.status(400).json({
                    message: `Only ${product.stock} items available in stock.`
                });
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

        return res.status(200).json({
            message: "Cart Updated Successfully.",
            cart
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
};



// Get User Cart
export const getCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.userId
        }).populate("products.product");

        if (!cart) {
            return res.status(200).json({
                products: []
            });
        }

        return res.status(200).json(cart);

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
};



// Update Quantity
export const updateCartItem = async (req, res) => {
    try {

        const { productId, quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be greater than 0."
            });
        }

        const cart = await Cart.findOne({
            user: req.userId
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart Not Found."
            });
        }

        const cartProduct = cart.products.find(
            item => item.product.toString() === productId
        );

        if (!cartProduct) {
            return res.status(404).json({
                message: "Product Not Found In Cart."
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product Not Found."
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: `Only ${product.stock} items available in stock.`
            });
        }

        cartProduct.quantity = quantity;

        await cart.save();

        return res.status(200).json({
            message: "Cart Updated Successfully.",
            cart
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
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
            return res.status(404).json({
                message: "Cart Not Found."
            });
        }

        cart.products = cart.products.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        return res.status(200).json({
            message: "Product Removed Successfully.",
            cart
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
};



// Clear Cart
export const clearCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.userId
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart Not Found."
            });
        }

        cart.products = [];

        await cart.save();

        return res.status(200).json({
            message: "Cart Cleared Successfully."
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
};
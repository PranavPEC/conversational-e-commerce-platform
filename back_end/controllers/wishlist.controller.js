import Wishlist from "../models/wishlist.model.js";
import Product from "../models/user.product.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return sendError(res, 400, "Product ID is required.");
        }

        const product = await Product.findById(productId);
        if (!product) {
            return sendError(res, 404, "Product Not Found.");
        }

        const existing = await Wishlist.findOne({ user: req.userId, product: productId });
        if (existing) {
            return sendError(res, 400, "Product is already in your wishlist.");
        }

        const wishlistItem = await Wishlist.create({ user: req.userId, product: productId });
        return sendSuccess(res, 201, "Added to Wishlist.", { wishlistItem });
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};

export const getUserWishlist = async (req, res) => {
    try {
        // populate() swaps the stored product ObjectId for the actual
        // product document — the frontend needs title/price/image to
        // render each card, not just an id.
        const wishlist = await Wishlist.find({ user: req.userId })
            .populate("product")
            .sort({ createdAt: -1 });

        return sendSuccess(res, 200, "Wishlist Fetched Successfully.", { wishlist });
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        // Filtering by { user: req.userId, product: productId } together
        // means ownership is enforced by the query itself — unlike Address,
        // which deletes by the document's own _id and needs an explicit
        // "does this belong to req.userId" check afterward. Here, someone
        // can only ever delete their OWN wishlist entry for that product,
        // by construction.
        const deleted = await Wishlist.findOneAndDelete({ user: req.userId, product: productId });
        if (!deleted) {
            return sendError(res, 404, "Item Not Found In Wishlist.");
        }

        return sendSuccess(res, 200, "Removed from Wishlist.");
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};
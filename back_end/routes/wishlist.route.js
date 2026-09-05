import express from "express";
import { addToWishlist, getUserWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";
import { checkAuth } from "../middleware/checkAuth.user.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/add", checkAuth, addToWishlist);
wishlistRouter.get("/mywishlist", checkAuth, getUserWishlist);
wishlistRouter.delete("/remove/:productId", checkAuth, removeFromWishlist);

export default wishlistRouter;
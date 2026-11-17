import express from "express";
import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    applyCoupon,
    removeCoupon,
} from "../controllers/cart.controller.js";

import { checkAuth } from "../middleware/checkAuth.user.js";

const cartRouter = express.Router();

cartRouter.post("/add", checkAuth, addToCart);

cartRouter.get("/", checkAuth, getCart);

cartRouter.put("/update", checkAuth, updateCartItem);

cartRouter.delete("/remove/:productId", checkAuth, removeCartItem);

cartRouter.delete("/clear", checkAuth, clearCart);

cartRouter.post("/apply-coupon", checkAuth, applyCoupon);
cartRouter.post("/remove-coupon", checkAuth, removeCoupon);

export default cartRouter;
import express from "express";

import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../controllers/cart.controller.js";

import { checkAuth } from "../middleware/checkAuth.user.js";

const cartRouter = express.Router();

cartRouter.post("/add", checkAuth, addToCart);

cartRouter.get("/", checkAuth, getCart);

cartRouter.put("/update", checkAuth, updateCartItem);

cartRouter.delete("/remove/:productId", checkAuth, removeCartItem);

cartRouter.delete("/clear", checkAuth, clearCart);

export default cartRouter;
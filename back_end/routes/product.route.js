import express from "express";

import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";

import { checkAuth } from "../middleware/checkAuth.user.js";
import { checkAdmin } from "../middleware/checkAdmin.middleware.js";
import { upload } from "../middleware/multer.js";

const productRouter = express.Router();

// Public Routes — anyone can browse products
productRouter.get("/all", getAllProducts);
productRouter.get("/:id", getProductById);

// Admin Routes — must be logged in AND be an admin
productRouter.post("/create", checkAuth, checkAdmin, upload.single("image"), createProduct);
productRouter.put("/update/:id", checkAuth, checkAdmin, upload.single("image"), updateProduct);
productRouter.delete("/delete/:id", checkAuth, checkAdmin, deleteProduct);

export default productRouter;
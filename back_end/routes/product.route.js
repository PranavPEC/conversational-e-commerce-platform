import express from "express";

import {
    createProduct,
    getAllProducts,
    getProductById,
    getMyProducts,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";

import { checkAuth } from "../middleware/checkAuth.user.js";
import { upload } from "../middleware/multer.js";
import { checkSeller } from "../middleware/checkSeller.middleware.js";
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";

const productRouter = express.Router();

// Public Routes — anyone can browse products
productRouter.get("/all", getAllProducts);

// Seller Routes — must be logged in AND be a seller
// NOTE: /my-products must be declared BEFORE /:id to prevent Express matching "my-products" as an id param
productRouter.get("/my-products", checkAuth, checkSeller, getMyProducts);
productRouter.post("/create", checkAuth, checkSeller, upload.single("image"), createProduct);
productRouter.put("/update/:id", checkAuth, checkSeller, validateObjectId(), upload.single("image"), updateProduct);
productRouter.delete("/delete/:id", checkAuth, checkSeller, validateObjectId(), deleteProduct);

// Public — declare LAST so /my-products above is not swallowed by this wildcard
productRouter.get("/:id", validateObjectId(), getProductById);

export default productRouter;
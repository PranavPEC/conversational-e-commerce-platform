import express from "express";

import {
    createAddress,
    getUserAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} from "../controllers/address.controller.js";

import { checkAuth } from "../middleware/checkAuth.user.js";

const addressRouter = express.Router();

addressRouter.post("/add", checkAuth, createAddress);
addressRouter.get("/myaddresses", checkAuth, getUserAddresses);
addressRouter.put("/update/:id", checkAuth, updateAddress);
addressRouter.delete("/delete/:id", checkAuth, deleteAddress);
addressRouter.put("/set-default/:id", checkAuth, setDefaultAddress);

export default addressRouter;
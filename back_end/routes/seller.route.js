import express from "express";
import { getSellerDashboardStats, submitSellerKycDocuments } from "../controllers/seller.controller.js";
import { checkAuth } from "../middleware/checkAuth.user.js";
import { checkSeller } from "../middleware/checkSeller.middleware.js";
import { upload } from "../middleware/multer.js";

const sellerRouter = express.Router();

sellerRouter.get("/dashboard", checkAuth, checkSeller, getSellerDashboardStats);
sellerRouter.post(
  "/kyc-documents",
  checkAuth,
  upload.fields([
    { name: "aadharImage", maxCount: 1 },
    { name: "panImage", maxCount: 1 },
  ]),
  submitSellerKycDocuments
);

export default sellerRouter;
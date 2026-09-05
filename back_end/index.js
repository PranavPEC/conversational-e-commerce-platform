import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import mongoConnect from "./config/db.js";
import cartRouter from "./routes/cart.route.js";
import productRouter from "./routes/product.route.js";
import paymentRouter from "./routes/payment.route.js";
import orderRouter from "./routes/order.route.js";
import wishlistRouter from "./routes/wishlist.route.js";
import addressRouter from "./routes/address.route.js";
import adminRouter from "./routes/admin.route.js";
import sellerRouter from "./routes/seller.route.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import cors from "cors";

dotenv.config();
// console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID)
// console.log("KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET)
const app=express();

app.use(cookieParser());
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter);
app.set("trust proxy", 1); // trust first proxy
const port=process.env.PORT || 5000;

app.use("/",userRouter);
app.use("/cart",cartRouter);
app.use("/product",productRouter);
app.use("/order",orderRouter);
app.use("/payment",paymentRouter);
app.use("/address",addressRouter);
app.use("/wishlist",wishlistRouter);
app.use("/admin",adminRouter);
app.use("/seller",sellerRouter);

app.listen(port,()=>{
    mongoConnect();
    console.log(`Server is listening on port ${port}`);
});
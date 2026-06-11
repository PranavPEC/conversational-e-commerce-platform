import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import mongoConnect from "./config/db.js";
import cartRouter from "./routes/cart.route.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/order.route.js";
import cors from "cors";
dotenv.config();

const app=express();

app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port=process.env.PORT || 5000;

app.use("/",userRouter);
app.use("/cart",cartRouter);
app.use("/product",productRouter);
app.use("/order",orderRouter);

app.listen(port,()=>{
    mongoConnect();
    console.log(`Server is listening on port ${port}`);
});
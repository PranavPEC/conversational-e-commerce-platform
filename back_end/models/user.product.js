import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  stock: Number,
  image: String,
},{
    timestamps:true
});

const Product= mongoose.model("Product", productSchema);
export default Product;
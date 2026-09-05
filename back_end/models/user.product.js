import mongoose from "mongoose";

export const PRODUCT_CATEGORIES = [
  "electronics",
  "fashion",
  "home",
  "beauty",
  "accessories",
  "audio",
  "laptops",
  "premium",
  "uncategorized",
];

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  stock: Number,
  image: String,
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  category: {
    type: [String],
    enum: PRODUCT_CATEGORIES,
    default: ["uncategorized"],
  },
},{
    timestamps:true
});

const Product= mongoose.model("Product", productSchema);
export default Product;

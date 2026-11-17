import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },

  // Set only from req.userId server-side — never trusted from the request body,
  // same as Product.seller
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // "platform" = admin coupon, discounts the whole cart
  // "seller"   = voucher, discounts only that seller's items in the cart
  scope: {
    type: String,
    enum: ["platform", "seller"],
    required: true,
  },

  // Required only when scope === "seller" — mirrors Product.seller / Order.seller
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () { return this.scope === "seller"; },
  },

  discountPercent: { type: Number, required: true, min: 1, max: 100 },
  maxDiscountAmount: { type: Number, required: false },
  minCartValue: { type: Number, required: false, default: 0 },

  expiryDate: { type: Date, required: false },
  usageLimit: { type: Number, required: false },
  usedCount: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
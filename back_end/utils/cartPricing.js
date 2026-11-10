import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js"

const groupBySellerSubtotals = (items) => {
  const sellerSubtotals = {};
  let subtotal = 0;
  for (let item of items) {
    if (!item.product) continue; // defensive null — same convention as everywhere else
    const sellerKey = item.product.seller ? item.product.seller.toString() : "unassigned";
    const lineTotal = item.product.price * item.quantity;
    sellerSubtotals[sellerKey] = (sellerSubtotals[sellerKey] || 0) + lineTotal;
    subtotal += lineTotal;
  }
  return { sellerSubtotals, subtotal };
};

const isSellerApproved = async (sellerId) => {
  const seller = await User.findById(sellerId).select("sellerStatus");
  return seller?.sellerStatus === "approved";
};

// Re-derives cart pricing from scratch every call — never trusts a stored
// discount value. `cart` must have products.product populated.
export const calculateCartPricing = async (cart) => {
  const items = cart.products.filter(item => item.product);
  const { sellerSubtotals, subtotal } = groupBySellerSubtotals(items);

  let discountAmount = 0;
  let perSellerDiscount = {};
  let appliedCoupon = null;
  let couponRemovedReason = null;

  if (cart.appliedCoupon) {
    const coupon = await Coupon.findById(cart.appliedCoupon);

    if (!coupon) {
      couponRemovedReason = "This coupon is no longer available.";
    } else if (!coupon.isActive) {
      couponRemovedReason = "This coupon is no longer active.";
    } else if (coupon.scope === "seller" && !(await isSellerApproved(coupon.seller))) {
      couponRemovedReason = "This voucher is no longer available.";
    } else if (coupon.expiryDate && coupon.expiryDate <= new Date()) {
      couponRemovedReason = "This coupon has expired.";
    } else if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
      couponRemovedReason = "This coupon has reached its usage limit.";
    } else if (
      coupon.scope === "seller" &&
      (!coupon.seller || !Object.prototype.hasOwnProperty.call(sellerSubtotals, coupon.seller.toString()))
    ) {
      couponRemovedReason = "This voucher only applies to a seller whose products aren't currently in your cart.";
    } else {
      const relevantSubtotal = coupon.scope === "seller"
        ? sellerSubtotals[coupon.seller.toString()]
        : subtotal;

      if (relevantSubtotal < (coupon.minCartValue || 0)) {
        couponRemovedReason = "Add more items to your cart to use this coupon.";
      } else {
        let rawDiscount = (relevantSubtotal * coupon.discountPercent) / 100;
        if (coupon.maxDiscountAmount != null) {
          rawDiscount = Math.min(rawDiscount, coupon.maxDiscountAmount);
        }
        discountAmount = rawDiscount;
        appliedCoupon = coupon;

        if (coupon.scope === "seller") {
          perSellerDiscount[coupon.seller.toString()] = rawDiscount;
        } else {
          // Platform coupon — spread proportionally across every seller
          // group by that seller's share of the cart subtotal
          for (const sellerKey of Object.keys(sellerSubtotals)) {
            perSellerDiscount[sellerKey] = subtotal > 0
              ? rawDiscount * (sellerSubtotals[sellerKey] / subtotal)
              : 0;
          }
        }
      }
    }
  }

  return {
    subtotal,
    discountAmount,
    total: subtotal - discountAmount,
    sellerSubtotals,
    perSellerDiscount,
    appliedCoupon,
    couponRemovedReason,
  };
};
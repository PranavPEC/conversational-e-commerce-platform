/**
 * DEV SEED SCRIPT: fills a fresh database with demo data so you can actually
 * see and click through every part of ShopAI.
 *
 * Put this file at back_end/scripts/seed.js and run from the back_end folder:
 *
 *   node scripts/seed.js            adds whatever is missing (safe to re-run)
 *   node scripts/seed.js --reset    WIPES users, products, orders, coupons,
 *                                   carts, addresses and wishlists first,
 *                                   then re-seeds. Only use on a dev database.
 *
 * Not imported anywhere and never runs on server start.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
dotenv.config();

import User from "../models/user.model.js";
import Product from "../models/user.product.js";
import Order from "../models/order.model.js";
import Address from "../models/address.model.js";
import Coupon from "../models/coupon.model.js";
import Cart from "../models/user.cart.js";
import Wishlist from "../models/wishlist.model.js";

if (!process.env.MONGODB_URL) {
    console.error("MONGODB_URL is missing from your .env file.");
    process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URL);
console.log(`DB Connected ✅  (database: "${mongoose.connection.name}")`);

const RESET = process.argv.includes("--reset");
const PASSWORD = "Test@1234";

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);
const img = (n) => `https://picsum.photos/seed/shopai-${n}/600/600`;

// ───────────────────────────── RESET ─────────────────────────────
if (RESET) {
    console.log("\n--reset given: wiping existing data...");
    await Promise.all([
        Order.deleteMany({}),
        Product.deleteMany({}),
        Coupon.deleteMany({}),
        Cart.deleteMany({}),
        Address.deleteMany({}),
        Wishlist.deleteMany({}),
        User.deleteMany({}),
    ]);
}

// ───────────────────────────── USERS ─────────────────────────────
const USER_DEFS = [
    { key: "admin", name: "Admin User", email: "admin@shopai.test", role: "admin", sellerStatus: "not_applicable" },
    { key: "seller1", name: "TechNova Store", email: "technova@shopai.test", role: "seller", sellerStatus: "approved", docs: true, gstin: "22AAAAA0000A1Z5" },
    { key: "seller2", name: "UrbanThread Co", email: "urbanthread@shopai.test", role: "seller", sellerStatus: "approved", docs: true },
    { key: "seller3", name: "Fresh Start Traders", email: "freshstart@shopai.test", role: "seller", sellerStatus: "pending", docs: true },   // waiting for admin review
    { key: "seller4", name: "Newbie Seller", email: "newbie@shopai.test", role: "seller", sellerStatus: "pending", docs: false },             // signed up, no documents yet
    { key: "cust1", name: "Aarav Sharma", email: "aarav@shopai.test", role: "user", sellerStatus: "not_applicable" },
    { key: "cust2", name: "Priya Verma", email: "priya@shopai.test", role: "user", sellerStatus: "not_applicable" },
];

const passwordHash = await bcryptjs.hash(PASSWORD, 10);
const users = {};

for (const def of USER_DEFS) {
    let user = await User.findOne({ email: def.email });
    if (!user) {
        user = await User.create({
            name: def.name,
            email: def.email,
            password: passwordHash,
            provider: "local",
            role: def.role,
            sellerStatus: def.sellerStatus,
            phone: "9876543210",
            ...(def.docs && {
                sellerDocuments: {
                    aadharNumber: "123456789012",
                    aadharImage: "https://placehold.co/800x500?text=Aadhar+Card",
                    panNumber: "ABCDE1234F",
                    panImage: "https://placehold.co/800x500?text=PAN+Card",
                    gstin: def.gstin,
                    submittedAt: daysAgo(2),
                },
            }),
        });
        console.log(`  + user  ${def.email}`);
    }
    users[def.key] = user;
}

// ──────────────────────────── ADDRESSES ───────────────────────────
const addressFor = {};
const ADDRESS_DEFS = [
    { key: "cust1", fullName: "Aarav Sharma", line1: "House 42, Sector 21", city: "Chandigarh", state: "Chandigarh", pincode: "160022" },
    { key: "cust2", fullName: "Priya Verma", line1: "Flat 7B, Green Heights", city: "Patiala", state: "Punjab", pincode: "147001" },
];
for (const a of ADDRESS_DEFS) {
    const user = users[a.key];
    let address = await Address.findOne({ user: user._id });
    if (!address) {
        address = await Address.create({
            user: user._id, label: "Home", fullName: a.fullName, phone: "9876543210",
            line1: a.line1, city: a.city, state: a.state, pincode: a.pincode, isDefault: true,
        });
        console.log(`  + address for ${user.email}`);
    }
    addressFor[a.key] = address;
}
const orderAddress = (addr) => ({
    label: addr.label, fullName: addr.fullName, phone: addr.phone, line1: addr.line1,
    line2: addr.line2, city: addr.city, state: addr.state, pincode: addr.pincode,
});

// ───────────────────────────── PRODUCTS ───────────────────────────
// stock: includes 0 (out of stock) and low numbers (<=5) on purpose
const PRODUCT_DEFS = [
    // seller1: TechNova
    { s: "seller1", title: "Wireless Noise-Cancelling Headphones", category: ["audio", "electronics"], price: 7999, stock: 25, description: "Over-ear Bluetooth headphones with active noise cancellation and 30-hour battery life." },
    { s: "seller1", title: "Bluetooth Speaker Mini", category: ["audio"], price: 2499, stock: 40, description: "Pocket-sized waterproof speaker with deep bass and 12 hours of playtime." },
    { s: "seller1", title: "14-inch Ultralight Laptop", category: ["laptops", "electronics"], price: 54999, stock: 8, description: "Thin and light laptop with a fast SSD, 16GB RAM and an all-day battery." },
    { s: "seller1", title: "Gaming Laptop 15.6-inch", category: ["laptops", "premium"], price: 89999, stock: 3, description: "High-refresh display, dedicated graphics and a cooling system built for long sessions." },
    { s: "seller1", title: "Mechanical Keyboard RGB", category: ["accessories", "electronics"], price: 3499, stock: 30, description: "Hot-swappable mechanical keyboard with per-key RGB lighting." },
    { s: "seller1", title: "Wireless Ergonomic Mouse", category: ["accessories"], price: 899, stock: 60, description: "Comfortable silent-click mouse with adjustable DPI." },
    { s: "seller1", title: "4K Action Camera", category: ["electronics"], price: 12999, stock: 0, description: "Waterproof 4K action camera with image stabilisation." },
    { s: "seller1", title: "Smartwatch Series X", category: ["electronics", "accessories"], price: 6499, stock: 15, description: "Fitness tracking, heart-rate monitoring and a bright AMOLED display." },
    { s: "seller1", title: "Power Bank 20000mAh", category: ["accessories", "electronics"], price: 1799, stock: 50, description: "Fast-charging power bank with dual USB ports." },
    { s: "seller1", title: "True Wireless Earbuds", category: ["audio"], price: 2999, stock: 4, description: "Compact earbuds with touch controls and a charging case." },
    // seller2: UrbanThread
    { s: "seller2", title: "Classic Denim Jacket", category: ["fashion"], price: 2799, stock: 20, description: "Timeless medium-wash denim jacket with a relaxed fit." },
    { s: "seller2", title: "Cotton Crew-Neck T-Shirt Pack", category: ["fashion"], price: 999, stock: 100, description: "Pack of three soft combed-cotton tees in everyday colours." },
    { s: "seller2", title: "Leather Sneakers", category: ["fashion", "premium"], price: 4599, stock: 12, description: "Handcrafted minimalist leather sneakers with cushioned insoles." },
    { s: "seller2", title: "Ceramic Dinner Set (16 pieces)", category: ["home"], price: 3299, stock: 14, description: "Durable glazed ceramic dinner set for four." },
    { s: "seller2", title: "Aromatic Soy Candle Set", category: ["home", "beauty"], price: 699, stock: 35, description: "Set of three hand-poured soy candles in calming scents." },
    { s: "seller2", title: "Memory Foam Pillow", category: ["home"], price: 1299, stock: 22, description: "Contoured memory foam pillow for neck support." },
    { s: "seller2", title: "Vitamin C Face Serum", category: ["beauty"], price: 849, stock: 45, description: "Brightening serum with 15% Vitamin C and hyaluronic acid." },
    { s: "seller2", title: "Herbal Shampoo 500ml", category: ["beauty"], price: 449, stock: 80, description: "Sulphate-free herbal shampoo for daily use." },
    { s: "seller2", title: "Luxury Leather Wallet", category: ["accessories", "premium"], price: 1999, stock: 18, description: "Slim full-grain leather wallet with RFID protection." },
    { s: "seller2", title: "Silk Scarf", category: ["fashion", "accessories"], price: 1299, stock: 0, description: "Lightweight printed silk scarf." },
];

const products = {};
let imageCounter = 1;
for (const def of PRODUCT_DEFS) {
    const seller = users[def.s];
    let product = await Product.findOne({ title: def.title, seller: seller._id });
    if (!product) {
        product = await Product.create({
            title: def.title,
            description: def.description,
            price: def.price,
            stock: def.stock,
            category: def.category,
            image: img(imageCounter),
            seller: seller._id,
        });
        console.log(`  + product ${def.title}`);
    }
    imageCounter++;
    products[def.title] = product;
}

// ───────────────────────────── COUPONS ────────────────────────────
const COUPON_DEFS = [
    { code: "WELCOME10", by: "admin", scope: "platform", discountPercent: 10, maxDiscountAmount: 200, minCartValue: 500, expiryDate: daysFromNow(90), usageLimit: 100 },
    { code: "SAVE20", by: "admin", scope: "platform", discountPercent: 20, maxDiscountAmount: 500, minCartValue: 2000, expiryDate: daysFromNow(60) },
    { code: "TECH15", by: "seller1", scope: "seller", discountPercent: 15, maxDiscountAmount: 1500, minCartValue: 1000, expiryDate: daysFromNow(45) },
    { code: "THREAD25", by: "seller2", scope: "seller", discountPercent: 25, maxDiscountAmount: 800, minCartValue: 1500, usageLimit: 20 },
    { code: "EXPIRED50", by: "admin", scope: "platform", discountPercent: 50, expiryDate: daysAgo(10) },                    // to test expiry message
    { code: "PAUSED30", by: "admin", scope: "platform", discountPercent: 30, expiryDate: daysFromNow(30), isActive: false },   // to test inactive message
];
const couponDocs = {};
for (const def of COUPON_DEFS) {
    let coupon = await Coupon.findOne({ code: def.code });
    if (!coupon) {
        const creator = users[def.by];
        coupon = await Coupon.create({
            code: def.code,
            createdBy: creator._id,
            scope: def.scope,
            seller: def.scope === "seller" ? creator._id : undefined,
            discountPercent: def.discountPercent,
            maxDiscountAmount: def.maxDiscountAmount,
            minCartValue: def.minCartValue || 0,
            expiryDate: def.expiryDate,
            usageLimit: def.usageLimit,
            isActive: def.isActive ?? true,
        });
        console.log(`  + coupon ${def.code}`);
    }
    couponDocs[def.code] = coupon;
}

// ───────────────────────────── ORDERS ─────────────────────────────
// Skipped entirely if seeded orders already exist, so re-running never duplicates them.
const alreadySeededOrders = await Order.countDocuments({ razorpayOrderId: /^seed_/ });

if (alreadySeededOrders === 0) {
    let orderCounter = 1;

    const makeOrder = ({ cust, seller, items, status, createdAt, deliveredAt, couponCode, returnReason, paymentStatus = "paid" }) => {
        const lines = items.map(([title, quantity]) => {
            const product = products[title];
            return { product: product._id, quantity, price: product.price };
        });
        const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
        const coupon = couponCode ? couponDocs[couponCode] : null;
        let discountAmount = 0;
        if (coupon) {
            discountAmount = (subtotal * coupon.discountPercent) / 100;
            if (coupon.maxDiscountAmount) discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
            discountAmount = Math.round(discountAmount * 100) / 100;
        }
        const id = `seed_${orderCounter++}`;
        return {
            user: users[cust]._id,
            seller: users[seller]._id,
            products: lines,
            subtotal,
            discountAmount,
            totalAmount: subtotal - discountAmount,
            couponCode: coupon?.code,
            couponId: coupon?._id,
            address: orderAddress(addressFor[cust]),
            addressId: addressFor[cust]._id,
            status,
            paymentStatus,
            razorpayOrderId: id,
            razorpayPaymentId: `${id}_pay`,
            returnReason,
            deliveredAt,
            createdAt,
            updatedAt: createdAt,
        };
    };

    const orders = [
        // One order in every interesting state, so every button and label is visible
        makeOrder({ cust: "cust1", seller: "seller1", items: [["Wireless Noise-Cancelling Headphones", 1], ["Wireless Ergonomic Mouse", 2]], status: "pending_approval", createdAt: daysAgo(1) }),
        makeOrder({ cust: "cust2", seller: "seller1", items: [["14-inch Ultralight Laptop", 1]], status: "pending_approval", createdAt: daysAgo(1) }),
        makeOrder({ cust: "cust1", seller: "seller2", items: [["Classic Denim Jacket", 1]], status: "placed", createdAt: daysAgo(3) }),
        makeOrder({ cust: "cust1", seller: "seller1", items: [["Smartwatch Series X", 1]], status: "shipped", createdAt: daysAgo(5) }),
        makeOrder({ cust: "cust1", seller: "seller2", items: [["Leather Sneakers", 1]], status: "delivered", createdAt: daysAgo(6), deliveredAt: daysAgo(2) }),   // inside the 7-day return window
        makeOrder({ cust: "cust1", seller: "seller1", items: [["Mechanical Keyboard RGB", 1]], status: "return_requested", createdAt: daysAgo(9), deliveredAt: daysAgo(4), returnReason: "Keys feel too stiff" }),
        makeOrder({ cust: "cust1", seller: "seller2", items: [["Aromatic Soy Candle Set", 3]], status: "cancelled", createdAt: daysAgo(8) }),
        makeOrder({ cust: "cust2", seller: "seller2", items: [["Herbal Shampoo 500ml", 2]], status: "rejected", createdAt: daysAgo(6) }),
        makeOrder({ cust: "cust1", seller: "seller1", items: [["True Wireless Earbuds", 1]], status: "delivered", createdAt: daysAgo(24), deliveredAt: daysAgo(20), couponCode: "WELCOME10" }),
        makeOrder({ cust: "cust2", seller: "seller2", items: [["Luxury Leather Wallet", 1]], status: "return_approved", createdAt: daysAgo(30), deliveredAt: daysAgo(26) }),
        makeOrder({ cust: "cust2", seller: "seller1", items: [["Bluetooth Speaker Mini", 2]], status: "refunded", createdAt: daysAgo(45), deliveredAt: daysAgo(40) }),
    ];

    // Older delivered orders spread over ~5 months so the dashboard charts have a shape
    const history = [
        ["seller1", [["Power Bank 20000mAh", 2]]], ["seller2", [["Cotton Crew-Neck T-Shirt Pack", 3]]],
        ["seller1", [["Gaming Laptop 15.6-inch", 1]]], ["seller2", [["Ceramic Dinner Set (16 pieces)", 1]]],
        ["seller1", [["Wireless Noise-Cancelling Headphones", 1]]], ["seller2", [["Vitamin C Face Serum", 2]]],
        ["seller1", [["Smartwatch Series X", 1], ["Power Bank 20000mAh", 1]]], ["seller2", [["Memory Foam Pillow", 2]]],
        ["seller1", [["Mechanical Keyboard RGB", 1]]], ["seller2", [["Classic Denim Jacket", 2]]],
        ["seller1", [["Bluetooth Speaker Mini", 1]]], ["seller2", [["Leather Sneakers", 1]]],
        ["seller1", [["14-inch Ultralight Laptop", 1]]], ["seller2", [["Luxury Leather Wallet", 2]]],
    ];
    history.forEach(([seller, items], i) => {
        const age = 55 + i * 7;   // 55 to ~146 days ago
        orders.push(makeOrder({
            cust: i % 2 === 0 ? "cust1" : "cust2", seller, items, status: "delivered",
            createdAt: daysAgo(age), deliveredAt: daysAgo(age - 4),
        }));
    });

    // insertMany keeps the createdAt values we set (so charts show real history)
    await Order.insertMany(orders);
    console.log(`  + ${orders.length} orders`);
} else {
    console.log("  = seeded orders already exist, skipping");
}

// ───────────────────────────── SUMMARY ────────────────────────────
console.log(`
Seed complete 🌱

All demo accounts use the password:  ${PASSWORD}

  ROLE      EMAIL                          NOTES
  admin     admin@shopai.test              approve sellers, manage coupons, analytics
  seller    technova@shopai.test           approved. Electronics, has a TECH15 voucher, GSTIN on file
  seller    urbanthread@shopai.test        approved. Fashion/home/beauty, has a THREAD25 voucher
  seller    freshstart@shopai.test         pending. Documents submitted, ready for admin review
  seller    newbie@shopai.test             pending. No documents yet, tests the "complete verification" CTA
  user      aarav@shopai.test              customer with order history in every status
  user      priya@shopai.test              customer

Coupons to try in the cart:
  WELCOME10 (10%, min 500)  SAVE20 (20%, min 2000)  TECH15 / THREAD25 (seller-only)
  EXPIRED50 and PAUSED30 are there to test the error messages.

Stock edge cases: "4K Action Camera" and "Silk Scarf" are out of stock;
"Gaming Laptop" and "True Wireless Earbuds" are low stock.
`);

await mongoose.disconnect();

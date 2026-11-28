/**
 * ONE-OFF MIGRATION. Run once after deploying the stock-reservation change.
 *
 *   node scripts/migrateReservations.js
 *
 * Orders created before this change have no `stockReserved` flag. Without it,
 * cancelling or refunding such an order would NOT put its stock back.
 * This marks every paid order that still "owns" its units as stockReserved: true.
 *
 * Safe to run more than once.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Order from "../models/order.model.js";

if (!process.env.MONGODB_URL) {
    console.error("MONGODB_URL is missing from your .env file.");
    process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URL);
console.log(`DB Connected (database: "${mongoose.connection.name}")`);

// Statuses where the customer still has (or may keep) the goods, so the stock
// is still taken off the shelf. cancelled / rejected / refunded already gave it back.
const HOLDING_STATUSES = [
    "pending_approval",
    "placed",
    "shipped",
    "delivered",
    "return_requested",
    "return_approved",
    "return_rejected",
];

const result = await Order.updateMany(
    {
        paymentStatus: "paid",
        status: { $in: HOLDING_STATUSES },
        stockReserved: { $ne: true },
    },
    { $set: { stockReserved: true } }
);

console.log(`Marked ${result.modifiedCount} existing order(s) as holding stock.`);

// Unpaid checkouts from before this change never took any stock. They are just
// clutter now, so close them. Only touches ones older than an hour, so a checkout
// that is happening right now is never affected.
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
const stale = await Order.updateMany(
    {
        paymentStatus: "pending",
        stockReserved: { $ne: true },
        createdAt: { $lt: oneHourAgo },
    },
    { $set: { paymentStatus: "expired" } }
);

console.log(`Closed ${stale.modifiedCount} old unpaid checkout(s).`);

await mongoose.disconnect();
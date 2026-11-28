/**
 * RACE TEST: proves the overselling bug and the fix, against your dev database.
 *
 *   node scripts/raceTest.js
 *
 * It creates a temporary product with ONE unit in stock, then lets 10 "buyers"
 * try to buy it at the same moment:
 *
 *   1. the OLD way (check stock, then decrement later)   -> oversells
 *   2. the NEW way (atomic reserveStock from inventory)   -> exactly one wins
 *   3. a two-item cart where one item is sold out         -> nothing is taken
 *
 * The temporary products are deleted at the end.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Product from "../models/user.product.js";
import { reserveStock } from "../utils/inventory.js";

if (!process.env.MONGODB_URL) {
    console.error("MONGODB_URL is missing from your .env file.");
    process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URL);
console.log(`DB Connected (database: "${mongoose.connection.name}")\n`);

const BUYERS = 10;
const makeProduct = (title, stock) =>
    Product.create({ title, description: "race test", price: 100, stock, category: ["uncategorized"] });

const created = [];

try {
    // ── 1. The OLD way ─────────────────────────────────────────────
    const oldProduct = await makeProduct("RACE TEST (old way)", 1);
    created.push(oldProduct._id);

    // Same shape as the old code: read stock, decide, write later.
    const naiveBuy = async () => {
        const product = await Product.findById(oldProduct._id);
        if (product.stock < 1) return false;                              // the "check"
        await new Promise((r) => setTimeout(r, Math.random() * 30));      // time passes (network, payment...)
        await Product.updateOne({ _id: oldProduct._id }, { $inc: { stock: -1 } });  // the "decrement"
        return true;
    };

    const oldResults = await Promise.all(Array.from({ length: BUYERS }, naiveBuy));
    const oldWinners = oldResults.filter(Boolean).length;
    const oldFinal = (await Product.findById(oldProduct._id)).stock;

    console.log("1) OLD WAY (check, then decrement later)");
    console.log(`   ${BUYERS} buyers, 1 unit in stock`);
    console.log(`   buyers who got it: ${oldWinners}   final stock: ${oldFinal}`);
    console.log(oldWinners > 1 ? "   -> OVERSOLD (this is the bug)\n" : "   -> got lucky this run, run it again\n");

    // ── 2. The NEW way ─────────────────────────────────────────────
    const newProduct = await makeProduct("RACE TEST (atomic)", 1);
    created.push(newProduct._id);

    const newResults = await Promise.all(
        Array.from({ length: BUYERS }, () =>
            reserveStock([{ productId: newProduct._id, quantity: 1 }])
        )
    );
    const newWinners = newResults.filter((r) => r.ok).length;
    const newFinal = (await Product.findById(newProduct._id)).stock;

    console.log("2) NEW WAY (atomic reserveStock)");
    console.log(`   ${BUYERS} buyers, 1 unit in stock`);
    console.log(`   buyers who got it: ${newWinners}   final stock: ${newFinal}`);
    console.log(newWinners === 1 && newFinal === 0 ? "   -> PASS: exactly one buyer won\n" : "   -> FAIL\n");

    // ── 3. All or nothing ──────────────────────────────────────────
    const inStock = await makeProduct("RACE TEST (in stock)", 5);
    const soldOut = await makeProduct("RACE TEST (sold out)", 0);
    created.push(inStock._id, soldOut._id);

    const cart = await reserveStock([
        { productId: inStock._id, quantity: 2 },
        { productId: soldOut._id, quantity: 1 },
    ]);
    const inStockAfter = (await Product.findById(inStock._id)).stock;

    console.log("3) ALL OR NOTHING (cart with one sold-out item)");
    console.log(`   reservation ok: ${cart.ok}   in-stock item stock after: ${inStockAfter} (was 5)`);
    console.log(!cart.ok && inStockAfter === 5 ? "   -> PASS: nothing was kept\n" : "   -> FAIL\n");

} finally {
    await Product.deleteMany({ _id: { $in: created } });
    await mongoose.disconnect();
}
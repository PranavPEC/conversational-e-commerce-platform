/**
 * ONE-TIME MIGRATION: convert product.category from String → [String]
 *
 * Run manually from the back_end directory:
 *   node scripts/migrateCategoryToArray.js
 *
 * This script is NOT imported anywhere and does NOT run on server start.
 * Safe to run multiple times — it skips products that are already arrays.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// ── Connect using the same pattern as config/db.js ──
await mongoose.connect(process.env.MONGODB_URL);
console.log("DB Connected ✅");

// Import the model AFTER connecting so mongoose uses the live connection
const { default: Product } = await import("../models/user.product.js");

// Find every product whose category is stored as a plain string ($type 2 = BSON string)
const stringProducts = await Product.find({ category: { $type: "string" } });
console.log(`Found ${stringProducts.length} product(s) with string category — migrating...`);

let migratedCount = 0;

for (const product of stringProducts) {
    const original = product.category;

    // Wrap the string in an array, preserve the original value exactly
    product.category = [original];

    // Use validateBeforeSave: false to bypass Mongoose validators during migration
    // because the schema now expects [String] but the doc still has a raw string
    await product.save({ validateBeforeSave: false });

    console.log(`  ✔ "${product.title}" — "${original}" → ["${original}"]`);
    migratedCount++;
}

console.log(`\nMigration complete. ${migratedCount} product(s) updated.`);
await mongoose.disconnect();

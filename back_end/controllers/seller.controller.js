import mongoose from "mongoose";
import Product from "../models/user.product.js";
import Order from "../models/order.model.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getSellerDashboardStats = async (req, res) => {
    try {
        const sellerObjectId = new mongoose.Types.ObjectId(req.userId);

        const [
            totalProducts,
            totalOrders,
            totalRevenueResult,
            pendingApprovals,
            ordersByStatusResult,
            revenueOverTimeResult,
            topProductsResult,
            lowStockProducts,
        ] = await Promise.all([
            Product.countDocuments({ seller: req.userId }),
            Order.countDocuments({ seller: req.userId }),
            Order.aggregate([
                { $match: { seller: sellerObjectId, paymentStatus: "paid" } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } },
            ]),
            Order.countDocuments({ seller: req.userId, status: "pending_approval" }),
            Order.aggregate([
                { $match: { seller: sellerObjectId } },
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]),
            Order.aggregate([
                { $match: { seller: sellerObjectId, paymentStatus: "paid" } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        revenue: { $sum: "$totalAmount" },
                    },
                },
                { $sort: { _id: 1 } },
                { $project: { _id: 0, month: "$_id", revenue: 1 } },
            ]),
            Order.aggregate([
                { $match: { seller: sellerObjectId } },
                { $unwind: "$products" },
                { $group: { _id: "$products.product", unitsSold: { $sum: "$products.quantity" } } },
                { $sort: { unitsSold: -1 } },
                { $limit: 5 },
            ]),
            Product.find({ seller: req.userId, stock: { $lte: 5 } }, "title stock")
                .sort({ stock: 1 })
                .limit(5),
        ]);

        const productIds = topProductsResult.map(item => item._id).filter(Boolean);
        const products = await Product.find({ _id: { $in: productIds } }, "title");
        const productTitleById = products.reduce((map, product) => {
            map[product._id.toString()] = product.title;
            return map;
        }, {});

        const summary = {
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenueResult[0]?.total || 0,
            pendingApprovals,
        };

        const ordersByStatus = ordersByStatusResult.map(item => ({
            status: item._id,
            count: item.count,
        }));

        const revenueOverTime = revenueOverTimeResult.slice(-12).map(item => ({
            month: item.month,
            revenue: item.revenue,
        }));

        const topProducts = topProductsResult.map(item => ({
            productId: item._id,
            title: productTitleById[item._id?.toString()] || "Deleted Product",
            unitsSold: item.unitsSold,
        }));

        return sendSuccess(res, 200, "Seller Dashboard Stats Fetched Successfully.", {
            summary,
            ordersByStatus,
            revenueOverTime,
            topProducts,
            lowStockProducts,
        });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};

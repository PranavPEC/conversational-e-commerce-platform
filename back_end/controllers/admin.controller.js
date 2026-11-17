import User from "../models/user.model.js";
import Product from "../models/user.product.js";
import Order from "../models/order.model.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

const SELLER_STATUS_TRANSITIONS = {
    pending: ["approved", "rejected"],
    approved: ["rejected"],
    rejected: ["approved"],
};

export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalSellers,
            totalProducts,
            totalOrders,
            totalRevenueResult,
            pendingApprovals,
            ordersByStatusResult,
            revenueOverTimeResult,
            topSellersResult,
            topProductsResult,
            productsByCategoryResult,
        ] = await Promise.all([
            User.countDocuments({ role: "user" }),
            User.countDocuments({ role: "seller" }),
            Product.countDocuments(),
            Order.countDocuments(),
            Order.aggregate([
                { $match: { paymentStatus: "paid" } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } },
            ]),
            Order.countDocuments({ status: "pending_approval" }),
            Order.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]),
            Order.aggregate([
                { $match: { paymentStatus: "paid" } },
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
                { $match: { paymentStatus: "paid", seller: { $ne: null } } },
                { $group: { _id: "$seller", revenue: { $sum: "$totalAmount" } } },
                { $sort: { revenue: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "seller",
                    },
                },
                { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 0,
                        sellerId: "$_id",
                        name: { $ifNull: ["$seller.name", "Unknown Seller"] },
                        revenue: 1,
                    },
                },
            ]),
            Order.aggregate([
                { $unwind: "$products" },
                { $group: { _id: "$products.product", unitsSold: { $sum: "$products.quantity" } } },
                { $sort: { unitsSold: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "product",
                    },
                },
                { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 0,
                        productId: "$_id",
                        title: { $ifNull: ["$product.title", "Deleted Product"] },
                        unitsSold: 1,
                    },
                },
            ]),
            Product.aggregate([
                { $unwind: "$category" },
                { $group: { _id: "$category", count: { $sum: 1 } } },
            ]),
        ]);

        const summary = {
            totalUsers,
            totalSellers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenueResult[0]?.total || 0,
            pendingApprovals,
        };

        const ordersByStatus = ordersByStatusResult.map(item => ({
            status: item._id,
            count: item.count,
        }));

        const revenueOverTime = revenueOverTimeResult.slice(-12);

        const topSellers = topSellersResult.map(item => ({
            sellerId: item.sellerId,
            name: item.name,
            revenue: item.revenue,
        }));

        const topProducts = topProductsResult.map(item => ({
            productId: item.productId,
            title: item.title,
            unitsSold: item.unitsSold,
        }));

        const productsByCategory = productsByCategoryResult.map(item => ({
            category: item._id,
            count: item.count,
        }));

        return sendSuccess(res, 200, "Dashboard Stats Fetched Successfully.", {
            summary,
            ordersByStatus,
            revenueOverTime,
            topSellers,
            topProducts,
            productsByCategory,
        });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


export const getSellerApplications = async (req, res) => {
    try {
        const sellers = await User.find(
            { role: "seller" },
            "name email sellerStatus createdAt sellerDocuments"
        ).sort({ createdAt: -1 });

        return sendSuccess(res, 200, "Seller Applications Fetched Successfully.", { sellers });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


export const updateSellerStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const seller = await User.findById(req.params.id);

        if (!seller || seller.role !== "seller") {
            return sendError(res, 404, "Seller Not Found.");
        }

        const allowedStatuses = SELLER_STATUS_TRANSITIONS[seller.sellerStatus] || [];
        if (!allowedStatuses.includes(status)) {
            return sendError(res, 400, `Cannot change seller status from ${seller.sellerStatus} to ${status}.`);
        }

        seller.sellerStatus = status;
        await seller.save();

        return sendSuccess(res, 200, "Seller Status Updated.", {
            seller: {
                _id: seller._id,
                name: seller.name,
                email: seller.email,
                sellerStatus: seller.sellerStatus,
            }
        });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};
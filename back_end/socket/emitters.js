import { getIO } from "./socketServer.js";
import { EVENTS, LOW_STOCK_THRESHOLD } from "./events.js";

// Realtime is a best-effort extra. A failed emit must never fail the request.
const safe = (fn) => {
    try {
        const io = getIO();
        if (io) fn(io);
    } catch (error) {
        console.error("Socket emit failed:", error.message);
    }
};

// product: a Product document (needs _id, stock; seller + title for low-stock alerts)
export const emitStockUpdate = (product, { notifySeller = false } = {}) => safe((io) => {
    const productId = product._id.toString();
    io.emit(EVENTS.PRODUCT_STOCK_UPDATED, { productId, stock: product.stock });

    if (notifySeller && product.seller && product.stock <= LOW_STOCK_THRESHOLD) {
        io.to(`user:${product.seller}`).emit(EVENTS.PRODUCT_LOW_STOCK, {
            productId,
            title: product.title,
            stock: product.stock,
        });
    }
});

export const emitOrderCreated = (order) => safe((io) => {
    if (!order.seller) return;
    io.to(`user:${order.seller}`).emit(EVENTS.ORDER_NEW, {
        orderId: order._id.toString(),
    });
});

// Notifies the buyer and the seller, EXCEPT whoever made the change (actorId):
// their own screen already updated from the REST response.
export const emitOrderStatusChanged = (order, actorId) => safe((io) => {
    const orderId = order._id.toString();
    const buyerId = order.user?.toString();
    const sellerId = order.seller?.toString();

    if (buyerId && buyerId !== actorId) {
        io.to(`user:${buyerId}`).emit(EVENTS.ORDER_STATUS_UPDATED, {
            orderId, status: order.status, audience: "buyer",
        });
    }
    if (sellerId && sellerId !== actorId) {
        io.to(`user:${sellerId}`).emit(EVENTS.ORDER_STATUS_UPDATED, {
            orderId, status: order.status, audience: "seller",
        });
    }
});

export const emitSellerStatusChanged = (sellerId, sellerStatus) => safe((io) => {
    io.to(`user:${sellerId}`).emit(EVENTS.SELLER_STATUS_UPDATED, { sellerStatus });
});

export const emitSellerApplicationSubmitted = ({ sellerId, name }) => safe((io) => {
    io.to("admins").emit(EVENTS.SELLER_APPLICATION_SUBMITTED, {
        sellerId: sellerId.toString(), name,
    });
});
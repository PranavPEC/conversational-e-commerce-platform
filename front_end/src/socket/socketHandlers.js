import store from '../redux/reduxStore.js'
import i18n from '../i18n/i18n.js'
import { EVENTS } from './socketEvents.js'
import { updateProductStock } from '../redux/reduxReducers/productReducers.js'
import { updateCartItemStock } from '../redux/reduxReducers/cartReducers.js'
import { updateWishlistItemStock } from '../redux/reduxReducers/wishlistReducers.js'
import { patchSellerProductStock } from '../redux/reduxReducers/sellerReducers.js'
import { patchOrderStatus } from '../redux/reduxReducers/orderReducers.js'
import { patchUserData } from '../redux/reduxReducers/authReducers.js'
import { fetchSellerOrders, fetchSellerApplications } from '../redux/reduxActions'

const { dispatch, getState } = store

// Registers every listener and returns a cleanup function.
// showToast(message, 'success' | 'error') comes from the RealtimeListener component.
export const registerSocketHandlers = (socket, showToast) => {

    const onStockUpdated = ({ productId, stock }) => {
        dispatch(updateProductStock({ productId, stock }))
        dispatch(updateCartItemStock({ productId, stock }))
        dispatch(updateWishlistItemStock({ productId, stock }))
        dispatch(patchSellerProductStock({ productId, stock }))

        // Tell the shopper if something in their cart just became unavailable
        const inCart = getState().cart.cartItems.find(i => i.product?._id === productId)
        if (inCart && stock < inCart.quantity) {
            showToast(i18n.t('rt_cart_item_stock'), 'error')
        }
    }

    const onLowStock = ({ title, stock }) => {
        showToast(i18n.t('rt_low_stock', { title, qty: stock }), 'error')
    }

    const onOrderNew = () => {
        fetchSellerOrders({ silent: true }).catch(() => { })
        showToast(i18n.t('rt_new_order'), 'success')
    }

    const onOrderStatus = ({ orderId, status, audience }) => {
        dispatch(patchOrderStatus({ orderId, status }))

        // Buyer and seller get different sentences; skip the toast if no text exists
        const key = audience === 'seller' ? `rt_seller_order_${status}` : `rt_order_${status}`
        if (i18n.exists(key)) {
            const isBad = status === 'rejected' || status === 'cancelled' || status === 'return_rejected'
            showToast(i18n.t(key), isBad ? 'error' : 'success')
        }
    }

    const onSellerStatus = ({ sellerStatus }) => {
        // The route guard reads userData.sellerStatus, so this flips the UI live
        dispatch(patchUserData({ sellerStatus }))
        showToast(
            i18n.t(sellerStatus === 'approved' ? 'rt_seller_approved' : 'rt_seller_rejected'),
            sellerStatus === 'approved' ? 'success' : 'error'
        )
    }

    const onApplicationSubmitted = () => {
        fetchSellerApplications({ silent: true }).catch(() => { })
        showToast(i18n.t('rt_new_application'), 'success')
    }

    socket.on(EVENTS.PRODUCT_STOCK_UPDATED, onStockUpdated)
    socket.on(EVENTS.PRODUCT_LOW_STOCK, onLowStock)
    socket.on(EVENTS.ORDER_NEW, onOrderNew)
    socket.on(EVENTS.ORDER_STATUS_UPDATED, onOrderStatus)
    socket.on(EVENTS.SELLER_STATUS_UPDATED, onSellerStatus)
    socket.on(EVENTS.SELLER_APPLICATION_SUBMITTED, onApplicationSubmitted)

    return () => {
        socket.off(EVENTS.PRODUCT_STOCK_UPDATED, onStockUpdated)
        socket.off(EVENTS.PRODUCT_LOW_STOCK, onLowStock)
        socket.off(EVENTS.ORDER_NEW, onOrderNew)
        socket.off(EVENTS.ORDER_STATUS_UPDATED, onOrderStatus)
        socket.off(EVENTS.SELLER_STATUS_UPDATED, onSellerStatus)
        socket.off(EVENTS.SELLER_APPLICATION_SUBMITTED, onApplicationSubmitted)
    }
}
import { convertInrToAed } from '../config/currency.js'

export const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
}

export const calculateCartTotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => {
        return sum + item.product.price * item.quantity
    }, 0)
    return total;
}

export const getInitial = (userData) => {
    return userData?.name?.charAt(0).toUpperCase()
}

export const buildFormData = (fields, imageFile, imageFieldName = 'image') => {
    const formData = new FormData()
    Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value)
        }
    })
    if (imageFile) formData.append(imageFieldName, imageFile)
    return formData
}

// price is ALWAYS the raw INR value from the DB/Redux store.
// When isRTL (Arabic) is active, we convert to AED just for display —
// the underlying INR number passed in is never mutated or stored.
export const formatCurrency = (price, isRTL) => {
    const displayPrice = isRTL ? convertInrToAed(price) : price

    return new Intl.NumberFormat(
        isRTL ? 'ar-AE' : 'en-IN',
        {
            style: 'currency',
            currency: isRTL ? 'AED' : 'INR',
            // INR prices in your data are whole rupees, so 0 decimals reads clean.
            // AED converted values are fractional (449 * 0.044 = 19.76), so keep 2.
            minimumFractionDigits: isRTL ? 2 : 0,
            maximumFractionDigits: isRTL ? 2 : 0,
        }
    ).format(displayPrice);
};


export const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
}

export const calculateCartTotal=(cartItems)=>{
    const total = cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity
  }, 0)
  return total;
}

export const getInitial=(userData)=>{
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
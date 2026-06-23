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

export const getInital=(userData)=>{
    return userData?.name?.charAt(0).toUpperCase()
}

export const buildFormData=(form,imageFile)=>{
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('price', form.price)
    formData.append('stock', form.stock)
    if (imageFile) formData.append('image', imageFile)

    return formData;
}
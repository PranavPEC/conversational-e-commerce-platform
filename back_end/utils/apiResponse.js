// back_end/utils/apiResponse.js
export const sendSuccess = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({ success: true, statusCode, message, data, error: null })
}

export const sendError = (res, statusCode, message, error = null) => {
    return res.status(statusCode).json({ success: false, statusCode, message, data: null, error })
}
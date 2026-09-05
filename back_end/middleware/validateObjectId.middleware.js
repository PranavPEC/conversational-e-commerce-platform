import mongoose from "mongoose";
import { sendError } from "../utils/apiResponse.js";

export const validateObjectId = (paramName = "id") => (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
        return sendError(res, 400, "Invalid ID format.");
    }
    next();
};
import express from "express";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateToken from "../config/token.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const home = (req, res) => {
    return sendSuccess(res, 200, "Welcome to Conversational E-Commerce Platform");
}

export const createNewUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password) {
            return sendError(res, 400, "Please provide Complete Info");
        }
        let existUser = await User.findOne({ email });
        if (existUser) {
            return sendError(res, 400, "User Already Exists. Login In");
        }
        let profileImage;
        if (req.file) {
            profileImage = await uploadOnCloudinary(req.file.path);
        }
        const hashpassword = await bcryptjs.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashpassword,
            profileImage
        });
        try {
            let token = generateToken(newUser._id);
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV == "production",
                sameSite: "lax",
                maxAge: 2 * 24 * 60 * 60 * 1000
            });
        }
        catch (error) {
            console.log("Error : ", error);
        }
        return sendSuccess(res, 201, "User Created Successfully");
    }
    catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
}

export const getUserById = async (req, res) => {
    try {
        if (req.params.id !== req.userId) {
            return sendError(res, 403, "Unauthorize Access.");
        }
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return sendError(res, 404, "User Not Found.")
        }
        return sendSuccess(res, 200, "User Fetched Successfully.", { user });
    }
    catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
}

export const updateUser = async (req, res) => {
    try {
        if (req.params.id !== req.userId) {
            return sendError(res, 403, "Unauthorize Access.");
        }

        const { name, email, phone, dateOfBirth, gender } = req.body;

        // ── Fetch first so we can enforce the gender-lock rule before saving ──
        // findByIdAndUpdate would blindly overwrite; we need the current value.
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return sendError(res, 404, "User Not Found.");
        }

        // ── Gender lock: set-once, never change ──
        // We return a 400 rather than silently dropping the value because silent
        // discarding is deceptive — the caller (including a direct API client
        // bypassing the UI) would think the save succeeded while the change was
        // quietly ignored. A 400 makes the contract explicit and honest.
        const currentGenderIsSet = user.gender && user.gender.trim() !== ''
        if (currentGenderIsSet && gender !== undefined && gender !== user.gender) {
            return sendError(res, 400, "Gender can only be set once and cannot be changed.");
        }

        // ── Apply all updatable fields ──
        if (name !== undefined)        user.name        = name;
        if (email !== undefined)       user.email       = email;
        if (phone !== undefined)       user.phone       = phone;
        if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;

        // Only write gender when it isn't already locked
        // (if locked and same value was sent, the guard above already passed, no need to reassign)
        if (!currentGenderIsSet && gender !== undefined) {
            user.gender = gender;
        }

        if (req.file) {
            user.profileImage = await uploadOnCloudinary(req.file.path);
        }

        await user.save();

        return sendSuccess(res, 200, "User Fetched Successfully.", { user });
    }
    catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
}

export const deleteUser = async (req, res) => {
    try {
        if (req.params.id !== req.userId) {
            return sendError(res, 403, "Unauthorize Access.");
        }
        const user = await User.findByIdAndDelete(req.params.id, { new: true }).select("-password");
        if (!user) {
            return sendError(res, 404, "User Not Found.");
        }
        return sendSuccess(res, 200, "User Deleted Successfully.", { user });
    }
    catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
}

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return sendError(res, 400, "Please provide Complete Info");
        }
        let existUser = await User.findOne({ email });
        if (!existUser) {
            return sendError(res, 404, "User Does Not Exists.");
        }
        let match = await bcryptjs.compare(password, existUser.password);
        if (!match) {
            return sendError(res, 400, "Invalid Password , Try Again.");
        }
        try {
            let token = generateToken(existUser._id);
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV == "production",
                sameSite: "lax",
                maxAge: 2 * 24 * 60 * 60 * 1000
            });
        }
        catch (error) {
            console.log("Error : ", error);
        }
        return sendSuccess(res, 200, "User Logged In Successfully.", {
            user: {
                _id: existUser._id,
                name: existUser.name,
                email: existUser.email,
                role: existUser.role,
            }
        });
    }
    catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return sendSuccess(res, 200, "User Successfully Logged Out.")
    }
    catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        let userId = req.userId;
        if (!userId) {
            return sendError(res, 401, "User not found.")
        }
        let user = await User.findById(userId).select("-password");
        if (!user) {
            return sendError(res, 404, "User not found.")
        }
        return sendSuccess(res, 200, "User Fetched Successfully.", { user });
    }
    catch (error) {
        console.error(error);
        return sendError(res, 500, error?.message || "Internal Server Error", error?.message || "Internal Server Error")
    }
}

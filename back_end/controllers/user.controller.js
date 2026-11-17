import express from "express";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateToken from "../config/token.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import adminAuth from "../config/firebaseAdmin.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes


export const home = (req, res) => {
    return sendSuccess(res, 200, "Welcome to Conversational E-Commerce Platform");
}

export const createNewUser = async (req, res) => {
    try {
        let { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
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
        if(role === 'admin'){
            role='user'; // Prevent users from creating admin accounts
        }
        const sellerStatus = role === 'seller' ? 'pending' : 'not_applicable';
        const hashpassword = await bcryptjs.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashpassword,
            profileImage,
            role,
            sellerStatus
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

export const socialAuth = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return sendError(res, 400, "ID Token is required");
        }

        // Verify the ID token using Firebase Admin SDK
        const decoded = await adminAuth.verifyIdToken(idToken);
        const { email, name, picture, firebase } = decoded;
        const provider = firebase.sign_in_provider === "facebook.com" ? "facebook" : "google"; // e.g., "google" or "facebook"
        // Check if the user already exists in your database
        if(!email){
            return sendError(res, 400, "Email not found in the token. Cannot proceed with authentication.");
        }
        let user = await User.findOne({ email });
        if (!user) {
            // If the user doesn't exist, create a new user
            user = await User.create({
                name,
                email,
                provider: provider,
                profileImage: picture
            });
        }

        // Generate a token for the user (you can use JWT or any other method)
        const token = generateToken(user._id);

        // Set the token in a cookie or return it in the response
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
        });

        return sendSuccess(res, 200, "Signed in successfully");
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Authentication Failed", error.message);
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
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (phone !== undefined) user.phone = phone;
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
            return sendError(res, 404, "User Not Found.");
        }
        if (existUser.provider !== 'local') {
            const providerLabel= existUser.provider === 'google' ? 'Google Sign-In' : 'Facebook Sign-In';
            return sendError(res, 400, `This account uses ${providerLabel}. Please log in with ${providerLabel}.`);
        }

        if(existUser.lockUntil && existUser.lockUntil > Date.now()) {
            const minutesLeft = Math.ceil((existUser.lockUntil - Date.now()) / (60 * 1000));
            return sendError(res, 429, `Too many login attempts. Please try again after ${minutesLeft} minutes.`);
        }

        let match = await bcryptjs.compare(password, existUser.password);
        if (!match) {
            existUser.loginAttempts = (existUser.loginAttempts || 0) + 1;
            if (existUser.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                existUser.lockUntil = Date.now() + LOCK_TIME;
                existUser.loginAttempts = 0; // Reset attempts after locking
                await existUser.save();
                return sendError(res, 429, `Too many login attempts. Please try again after 15 minutes.`);
            }
            await existUser.save();
            const attemptsLeft = MAX_LOGIN_ATTEMPTS - existUser.loginAttempts;
            return sendError(res,400,`Invalid Password . ${attemptsLeft} attempts left before account lock.`);
        }
        existUser.loginAttempts = 0;
        existUser.lockUntil = undefined;
        await existUser.save(); 
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
                sellerStatus: existUser.sellerStatus,
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

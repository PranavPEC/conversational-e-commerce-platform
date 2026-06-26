import express from "express";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateToken from "../config/token.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const home = (req, res) => {
    res.status(200).json({ message: "Welcome to Conversational E-Commerce Platform" })
}

export const createNewUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide Complete Info" });
        }
        let existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "User Already Exists. Login In" });
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
        return res.status(201).json({ message: "User Created Successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}
export const getUserById = async (req, res) => {
    try {
        if (req.params.id !== req.userId) {
            return res.status(403).json({
                message: "Unauthorize Access."
            });
        }
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User Not Found."
            })
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}
export const updateUser = async (req, res) => {
    try {
        if (req.params.id !== req.userId) {
            return res.status(403).json({
                message: "Unauthorize Access."
            });
        }
        const { name, email, profileImage } = req.body;

const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, profileImage },
    { new: true }
).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User Not Found." });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}
export const deleteUser = async (req, res) => {
    try {
        if (req.params.id !== req.userId) {
            return res.status(403).json({
                message: "Unauthorize Access."
            });
        }
        const user = await User.findByIdAndDelete(req.params.id, { new: true }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User Not Found." });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide Complete Info" });
        }
        let existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(404).json({ message: "User Does Not Exists." });
        }
        let match = await bcryptjs.compare(password, existUser.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid Password , Try Again." });
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
        return res.status(200).json({
            user: {
                _id: existUser._id,
                name: existUser.name,
                email: existUser.email,
                role: existUser.role,
            }
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "User Successfully Logged Out." })
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        let userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not found." })
        }
        let user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: error })
    }
}

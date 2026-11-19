import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

let io = null;

// Minimal cookie-header parser: "a=1; token=abc" -> { a: "1", token: "abc" }
const parseCookies = (header = "") => {
    const cookies = {};
    for (const part of header.split(";")) {
        const index = part.indexOf("=");
        if (index === -1) continue;
        const name = part.slice(0, index).trim();
        const value = part.slice(index + 1).trim();
        if (!name) continue;
        try {
            cookies[name] = decodeURIComponent(value);
        } catch {
            cookies[name] = value;   // malformed encoding: keep the raw value
        }
    }
    return cookies;
};

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        // Express's cors() does not cover Socket.io, it needs its own config
        cors: { origin: process.env.CLIENT_URL, credentials: true },
    });

    // Identify the connection using the same httpOnly cookie as the REST API
    io.use(async (socket, next) => {
        try {
            const cookies = parseCookies(socket.handshake.headers.cookie || "");
            if (!cookies.token) return next();            // guest: allowed

            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("role");
            if (user) {
                socket.data.user = { id: user._id.toString(), role: user.role };
            }
            next();
        } catch {
            next();    // bad/expired token: treat as guest instead of rejecting
        }
    });

    io.on("connection", (socket) => {
        const user = socket.data.user;
        if (!user) return;
        socket.join(`user:${user.id}`);
        if (user.role === "admin") socket.join("admins");
    });

    return io;
};

export const getIO = () => io;
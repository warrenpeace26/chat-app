// Middleware to protect routes
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next)=> {
    try {
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return res.json({ success: false, message: "Unauthorized, token missing" });
}

const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select("-password");

        if(!user) {
          res.json({success: false, message: "User not found"});
        }

        req.user = user;
        next();
    } catch (error) {
        res.json({success: false, message: error.message});
        console.log(error.message);
        
    }
}
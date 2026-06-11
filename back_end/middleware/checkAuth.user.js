import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";
dotenv.config();
export const checkAuth=(req,res,next)=>{
try{
    let token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:"User is not Authenticated."});
    }
    let decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.userId=decoded.id;
    next();
}
catch(error){
return  res.status(401).json({
    message:"Invalid or Expired Token"
}
);
}
}
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const generateToken=(id)=>{
let token= jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"2d"});
return token;
}
export default generateToken;
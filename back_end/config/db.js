import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const mongoURL=process.env.MONGODB_URL;
const mongoConnect=async()=>{
    try{
        await mongoose.connect(mongoURL);
        console.log("DB Connected ✅.");
    }
    catch(e){
        console.log("Error: ",e);
    }
}
export default mongoConnect;
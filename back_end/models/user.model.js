import mongoose, { trusted } from "mongoose";
const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
 role: {
    type: String,
    default: "user",
  },
  profileImage:{
    type:String,
    required:false
  }
},{
    timestamps:true
})
let User=mongoose.model("User",userSchema);
export default User;
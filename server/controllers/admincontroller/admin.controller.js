import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Admin } from "../../models/admin/admin.model";
import { User } from "../../models/user/user.model";


export const signup = async function (req,res){
  const {name, email, password} = req.body;

  if(!name || !email || !password){
    return res.status(400).json({
      message:"Something is missing",
      success:false
    })
  }

  const isEmailTaken = await User.findOne({ email }) || await Admin.findOne({ email });

  if (isEmailTaken) {
    return res.status(400).json({
      message: "Email already in use",
      success: false,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newAdmin = await Admin.create({
    name,
    email,
    password:hashedPassword
  })

  return res.status(200).json({
    message:"Admin account created successfully",
    succes:true,
    newAdmin
  })



}
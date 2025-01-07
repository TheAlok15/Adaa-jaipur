import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Admin } from "../../models/admin/admin.model";
import { User } from "../../models/user/user.model";


export const signup = async function (req,res){
  try 
  {
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
    password:hashedPassword,
    status:"pending"
  })

  await newAdmin.save()
  return res.status(201).json({
    message:"Admin request send for verify ",
  })

} 
  catch (error) 
  {
    console.log("Error in admin signup", error.message || error);
    return res.json({
      message:"Internal server error",
      success:false
    })
    
  }
};

export const signin = async function (req,res){
  try 
  {
    const { email, password} = req.body;

  if( !email || !password){
    return res.status(400).json({
      message:"Something is missing",
      success:false
    })
  }

  const admin = await Admin.findOne({email})

  if(!admin)
  {
    return res.status(404).json({
      message:"Email not found",
      message:false
    })
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) 
    {
      return res.status(401).json({
        message: "Invalid credentials" ,
        success:false
      });
    }

  if (admin !== approved)
  {
    return res.status(400).json({
      message:"Approval required",
      message:false
    })
  }

  if (admin == approved)
  {
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_ADMIN_SECRET,
      { expiresIn: "30d" } 
    );
    return res.json({
      message: "Login successful.",
      success: true,
      token,
      role: admin.role,
    });

  }

  if (admin.role === "superadmin") {
     return res.json({ message: `Welcome, Super Admin ${superAdmin.name}` });
    } else {
     return res.json({ message: "Login successful.", admin });
    }

} 
  catch (error) 
  {
    console.log("Error in admin signin", error.message || error);
    return res.json({
      message:"Internal server error",
      success:false
    })
    
  }
};

export const logout = async (req, res) => {
  try {
    // Invalidate the token (for example, by clearing it on the client side)
    res.clearCookie("token"); // Use this if you're working with cookies
    return res.json({
      message: "Logout successful.",
      success: true,
    });
  } catch (error) {
    console.error("Error in admin logout:", error.message || error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};



  
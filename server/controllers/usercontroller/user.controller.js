import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Admin } from "../../models/admin/admin.model.js"
import { User } from '../../models/user/user.model.js';

  export const signup = async (req,res)=>{
   try {
      const { name, email, password } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Something is missing",
          success: false,
        });
      }
  
      const user = await User.findOne({email}) || await Admin.findOne({email});
  
      if (user) {
        return res.status(401).json({
          message: "User already exist",
          success: false,
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await User.create({
        name,
        email,
        password:hashedPassword,
      });
  
      return res.status(201).json({
        message: "Account created successfully",
        success: true,
      });

    } 
    catch (error) 
    {
      console.log("Error in signup" + error || error.message);
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
  };
  
  export const signin = async function (req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          message: "User not found",
          success: false,
        });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Incorrect email",
        });
      }
  
      if (!user.password) {
        return res.status(500).json({
          success: false,
          message: "Incorrect password or email",
        });
      }
  
      const passwordAfterHashed = await bcrypt.compare(password, user.password);
  
      if (!passwordAfterHashed) {
        return res.status(400).json({
          success: false,
          message: "Incorrect password",
        });
      }

       const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_USER_SECRET,
            { expiresIn: "1d" }
          );
      
         
          return res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 10 * 24 * 60 * 60 * 1000, 
          }).status(200).json({
            message: `Welcome back ${user.name}`,
            success: true,
            user,
          });
  
      
    } catch (e) {
      console.log("Error in signin", e.message);
       return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
  };

  export const logout = async function (req,res){

  try
  {
      return res.cookie("token","",{maxAge:0}).json({
        message:"Logged out succesfully",
        success:true
      })
  }
  catch(e)
  {
    console.log("Error in logout", e.message || e);
    return res.status(501).json({
      message:"Internal server error",
      success:false
    }) 
      
  }
  };

  export const updateProfile = async function (req,res){
    try 
    {
      const userId = req.id;
      const { name, address } = req.body
      const { street, postalCode, state, country } = address || {};
  
      if (!userId) 
      {
        return res.status(400).json({
          message:"You are not authorized",
          success:false
        })
      }

      const isName = name && name !== user.name;
      const isStreet = street && street !== user.address.street;
      const isPostalCode = postalCode && postalCode !== user.address.postalCode;
      const isState = state && state !== user.address.state;
      const isCountry = country && country !== user.address.country;


      if (!isName && !isStreet && !isPostalCode && !isState && !isCountry) {
        return res.status(400).json({
          message:"Nothing changes",
          success:false
        })
        
      }

      if(isName) user.name = name
      if(isStreet) user.address.street = street
      if(isPostalCode) user.address.postalCode = postalCode
      if(isState) user.address.state = state
      if(isCountry) user.address.country = country

      await user.save()

      return res.status(200).json({
        message:"Profile updated successfully",
        success:true
      })
      
    } 
    catch (error) 
    {
      console.log("Error in update profile of user", error.message || error);
      return res.status(501).json({
        message:"Internal server error",
        success:false
      })
    }

  };


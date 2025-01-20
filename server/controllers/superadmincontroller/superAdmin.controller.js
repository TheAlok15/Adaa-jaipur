import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

 const verifySuperAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (email !== process.env.SUPERADMIN_EMAIL) {
    return res.status(403).json({ message: "Access denied: Invalid email", success: false});
  }

  const isPasswordValid = await bcrypt.compare(password, process.env.SUPERADMIN_PASSWORD);
  if (!isPasswordValid) {
    return res.status(403).json({ message: "Access denied: Invalid password", success: false });
  }

  const token = jwt.sign(
    {
      name: process.env.SUPERADMIN_NAME,
      role: "superadmin"
    }, process.env.JWT_SUPERADMIN_SECRET, {expiresIn:"20d"} 
  )

  return res.status(200).json({
    token
  })
  
};

export default verifySuperAdmin;

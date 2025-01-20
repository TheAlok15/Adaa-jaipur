import bcrypt from "bcrypt";

 const verifySuperAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  if (email !== process.env.SUPERADMIN_EMAIL) {
    return res.status(403).json({ message: "Access denied: Invalid email", success: false});
  }

  const isPasswordValid = await bcrypt.compare(password, process.env.SUPERADMIN_PASSWORD);
  if (!isPasswordValid) {
    return res.status(403).json({ message: "Access denied: Invalid password", success: false });
  }

  next();
};

export default verifySuperAdmin;

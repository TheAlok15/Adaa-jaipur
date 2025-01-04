import jwt from "jsonwebtoken";
import { Admin } from "../../models/admin/admin.model";

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization") ?.replace("Bearer ", "");
    // when use cookies then const token = req.cookies.token

    if (!token) {
      return res.status(401).json({
        message: "Authentication token required.",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found.",
        success: false,
      });
    }

    if (admin.status !== "approved") {
      return res.status(403).json({
        message: "Access denied. Admin approval required.",
        success: false,
      });
    }

    // Attach admin details to the request object for downstream use
    req.admin = admin;
    next();

  } catch (error) 
  {
    return res.status(500).json({
      message: "Authentication failed.",
      error: error.message,
    });
  }
};

import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const userOrGuestMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decodeInfo = jwt.verify(token, process.env.JWT_USER_SECRET);

      if (!decodeInfo) {
        return res.status(401).json({
          message: "Invalid token.",
          success: false,
        });
      }

      req.id = decodeInfo.userId; 
    } else {
      // Handle guest logic
      if (!req.cookies.guestId) {
        const guestId = uuidv4(); // Generate a unique guest ID
        res.cookie("guestId", guestId, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        req.guestId = guestId;
      } else {
        req.guestId = req.cookies.guestId;
      }
    }

    next();
  } catch (error) {
    console.error("Error in authentication/guest middleware:", error.message || error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

export default userOrGuestMiddleware;

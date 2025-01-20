import jwt from'jsonwebtoken';

 const superAuthentication = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "superadmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.superAdmin = decoded; // Attach decoded details (e.g., name) to the request object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

export default superAuthentication;

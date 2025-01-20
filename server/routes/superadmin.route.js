import express from 'express'
const router = express.Router();
import verifySuperAdmin from "../middleware/superAuth.js"

router.post("/login", verifySuperAdmin, (req, res) => {
  res.status(200).json({ message: "Welcome, Super Admin!" });
});

export default router;

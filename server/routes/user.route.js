import express from "express"
import { logout, signin, signup } from "../controllers/usercontroller/user.controller.js"
import userOrGuestMiddleware from "../middleware/userAuthentication.js"
import { addToCart, removeFromCart, updateItemQuantity, viewCart } from "../controllers/usercontroller/cart.controller.js";
const router = express.Router()

router.route("/signup").post(signup)
router.route("/signin").post(signin)
router.route("/logout").post(logout)

router.route("/cart/add").post(userOrGuestMiddleware, addToCart);

// Update cart item quantity (increment/decrement)
router.route("/cart/update").put(userOrGuestMiddleware, updateItemQuantity);

// Remove item from cart
router.route("/cart/remove").delete(userOrGuestMiddleware, removeFromCart);

// Get cart details
router.route("/cart").get(userOrGuestMiddleware, viewCart);

export default router;
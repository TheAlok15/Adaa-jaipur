import express from "express";
import { signup, signin, logout, updateProfile } from "../controllers/usercontroller/user.controller.js"
import { addToCart, removeFromCart, viewCart, updateItemQuantity } from "../controllers/usercontroller/cart.controller.js";
import { addToWishlist, removeFromWishlist, viewWishlist } from "../controllers/usercontroller/wishlist.controller.js";
import { placeOrder, getOrderDetails} from "../controllers/usercontroller/order.controller.js";
import { addReview, viewReviews } from "../controllers/usercontroller/review.controller.js";
import userOrGuestMiddleware from "../middleware/userAuthentication.js"; // Add authentication middleware

const router = express.Router();

// User routes
router.route("/signup").post(signup);  // No middleware required for signup
router.route("/signin").post(signin);  // No middleware required for signin
router.route("/logout").post(userOrGuestMiddleware, logout); // Authentication required for logout
router.route("/update-profile").put(userOrGuestMiddleware, updateProfile); // Authentication required for profile update

// Cart routes
router.route("/cart/add").post(userOrGuestMiddleware, addToCart); // Authentication required for adding to cart
router.route("/cart/remove").post(userOrGuestMiddleware, removeFromCart); // Authentication required for removing from cart
router.route("/cart/view").get(userOrGuestMiddleware, viewCart); // Authentication required for viewing cart
router.route("/cart/update-quantity").put(userOrGuestMiddleware, updateItemQuantity); // Authentication required for updating item quantity

// Wishlist routes
router.route("/wishlist/add").post(userOrGuestMiddleware, addToWishlist); // Authentication required for adding to wishlist
router.route("/wishlist/remove").post(userOrGuestMiddleware, removeFromWishlist); // Authentication required for removing from wishlist
router.route("/wishlist/view").get(userOrGuestMiddleware, viewWishlist); // Authentication required for viewing wishlist

// Order routes
router.route("/order/place").post(userOrGuestMiddleware, placeOrder); // Authentication required for placing an order
router.route("/order/history").get(userOrGuestMiddleware, getOrderDetails); // Authentication required for viewing order history
// router.route("/order/cancel").post(userOrGuestMiddleware, cancelOrder); // Authentication required for cancelling an order

// Review routes
router.route("/review/add").post(userOrGuestMiddleware, addReview); // Authentication required for adding a review
router.route("/review/view").get(userOrGuestMiddleware, viewReviews); // Authentication required for viewing reviews
// router.route("/review/delete").post(userOrGuestMiddleware, deleteReview); // Authentication required for deleting a review

export default router;

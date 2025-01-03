import { Order } from "../../models/user/order.model.js";
import { Cart } from "../../models/user/cart.model.js";

export const createOrder = async function (req, res) {
  try {
    const authenticatedUserId = req.id;

    if (!authenticatedUserId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in to place an order.",
        success: false,
      });
    }

    const { paymentMethod, shippingAddress } = req.body;

    // Validate required fields
    if (!paymentMethod || !shippingAddress) {
      return res.status(400).json({
        message: "Payment method and shipping address are required.",
        success: false,
      });
    }

    // Fetch the user's cart
    const cart = await Cart.findOne({ userDetails: authenticatedUserId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty. Add items to your cart before placing an order.",
        success: false,
      });
    }

    // Create a new order
    const order = new Order({
      userDetails: authenticatedUserId,
      items: cart.items,
      paymentMethod,
      shippingAddress,
      totalAmount: cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    });

    // Save the order
    await order.save();

    // Clear the user's cart after placing the order
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      success: true,
      order,
    });
  } 
  catch (error) 
  {
    console.error("Error in createOrder:", error.message || error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getOrderDetails = async function (req, res) {
  try {
    const authenticatedUserId = req.id;

    // Ensure user is authenticated
    if (!authenticatedUserId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in to view orders.",
        success: false,
      });
    }

    // Fetch user's orders
    const orders = await Order.find({ userDetails: authenticatedUserId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No orders found.",
        success: false,
      });
    }

    res.status(200).json({
      message: "Orders retrieved successfully",
      success: true,
      orders,
    });
  } 
  catch (error) 
  {
    console.error("Error in getOrderDetails:", error.message || error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

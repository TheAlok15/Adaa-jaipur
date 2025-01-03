import { Cart } from "../../models/user/cart.model.js";
import { Product } from "../../models/user/product.model.js";

// Add product to cart
// Below i explain the working also
export const addToCart = async function (req, res) {
  try {
    const { productId, quantity, size, color, price } = req.body;

    if (!productId || !quantity || !price) {
      return res.status(400).json({
        message: "Product ID, quantity, and price are required",
        success: false,
      });
    }

    const authenticatedUserId = req.id || null;
    const identifyUserOrGuest = authenticatedUserId ? { userDetails: authenticatedUserId }:{ guestId: req.guestId };

    let cart = await Cart.findOne(identifyUserOrGuest);

    if (!cart) {
      cart = new Cart({
        ...identifyUserOrGuest,
        items: [],
        grandTotal: 0,
      });
    }

    const productAlreadyExist = cart.items.findIndex((item) =>
        item.productId.toString() === productId && (!size || item.size === size) && (!color || item.color === color)
    );

    if (productAlreadyExist >= 0) 
    {
      cart.items[productAlreadyExist].quantity += quantity;
      cart.items[productAlreadyExist].totalPrice = cart.items[productAlreadyExist].quantity *
      cart.items[productAlreadyExist].price;
    } 
    else
     {
      cart.items.push({
        productId,
        quantity,
        size,
        color,
        price,
        totalPrice: quantity * price,
      });
    }

    cart.grandTotal = cart.items.reduce((total, item) => total + item.totalPrice, 0);

    await cart.save();

    res.status(200).json({
      message: "Product added to cart",
      success: true,
      cart,
    });
  } 
  catch (error) 
  {
    console.error("Error in addToCart:", error.message || error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Remove product from cart (no soft delete, just removal)
export const removeFromCart = async function (req, res) {
  try {
    const { productId, size, color } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        success: false,
      });
    }

    const authenticatedUserId = req.id || null;
    const identifyUserOrGuest = authenticatedUserId ? { userDetails: authenticatedUserId }:{ guestId: req.guestId };

    let cart = await Cart.findOne(identifyUserOrGuest);

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    const productIndex = cart.items.findIndex((item) =>
      item.productId.toString() === productId && (!size || item.size === size) && (!color || item.color === color)
    );

    if (productIndex === -1) {
      return res.status(404).json({
        message: "Product not found in cart",
        success: false,
      });
    }

    // Remove item from cart
    cart.items.splice(productIndex, 1);

    // Recalculate grand total after removal
    cart.grandTotal = cart.items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    await cart.save();

    res.status(200).json({
      message: "Product removed from cart",
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error in removeFromCart:", error.message || error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// View cart
export const viewCart = async function (req, res) {
  try {
    const authenticatedUserId = req.id || null;
    const identifyUserOrGuest = authenticatedUserId ? { userDetails: authenticatedUserId }:{ guestId: req.guestId };

    const cart = await Cart.findOne(identifyUserOrGuest).populate(
      "items.productId"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        message: "Cart is empty",
        success: false,
      });
    }

    res.status(200).json({
      message: "Cart retrieved successfully",
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error in viewCart:", error.message || error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Update item quantity (increment or decrement)
export const updateItemQuantity = async function (req, res) {
  try {
    const { productId, action, size, color } = req.body;

    if (!productId || !action) {
      return res.status(400).json({
        message: "Product ID and action are required",
        success: false,
      });
    }

    if (!["increment", "decrement"].includes(action)) {
      return res.status(400).json({
        message: "Action must be 'increment' or 'decrement'",
        success: false,
      });
    }

    const authenticatedUserId = req.id || null;
    const identifyUserOrGuest = authenticatedUserId
      ? { userDetails: authenticatedUserId }
      : { guestId: req.guestId };

    const cart = await Cart.findOne(identifyUserOrGuest);

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    const productIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        (!size || item.size === size) &&
        (!color || item.color === color)
    );

    if (productIndex === -1) {
      return res.status(404).json({
        message: "Product not found in cart",
        success: false,
      });
    }

    const item = cart.items[productIndex];

    if (action === "increment") {
      item.quantity += 1;
    } else if (action === "decrement") {
      item.quantity -= 1;

      if (item.quantity <= 0) {
        // If quantity becomes 0, remove it from the cart
        cart.items.splice(productIndex, 1);
      }
    }

    item.totalPrice = item.quantity * item.price;

    cart.grandTotal = cart.items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    await cart.save();

    res.status(200).json({
      message: `Item ${action === "increment" ? "incremented" : "decremented"} successfully`,
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error in updateItemQuantity:", error.message || error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

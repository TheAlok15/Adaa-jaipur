import { Cart } from "../../models/user/cart.model.js"

export const addOnCart = async function (req,res){

  try 
  {
    const {productId, quantity, size, color} = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({
      message: "Product ID and quantity are required",
      success: false,
    });
  }

  const authenticatedUserId = req.id || null;
  const identifyUserOrGuest = authenticatedUserId ? { userDetails : authenticatedUserId} : {guestId: req.guestId};


  let cart = await Cart.findOne(identifyUserOrGuest);

  if(!cart)
  {
      cart  = new Cart({
        ...identifyUserOrGuest,
        items:[],
      });

  }

  const productAlreadyExist = cart.items.findIndex((item)=>{
     return item.productId.toString() === productId && (!size ||item.size === size) && (!color || item.color === color)

  });

  if(productAlreadyExist >= 0)
  {
    cart.items[productAlreadyExist].quantity += quantity;

  }
  else
  {
    cart.items.push({
      productId,
      quantity,
      size,
      color
    })
  }

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

export const removeFromCart = async function (req,res){

    try 
    {
      const {productId, quantity, size, color} = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Product ID is required",
        success: false,
      });
    }

    const authenticatedUserId = req.id || null;
    const identifyUserOrGuest = authenticatedUserId ? { userDetails : authenticatedUserId} : {guestId: req.guestId};


    let cart = await Cart.findOne(identifyUserOrGuest);

    if(!cart)
    {
      return res.status(404).json({
           message: "Cart is empty",
           success: false });

    }

    // Find the product in the cart
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

  // Decrement the quantity
  if (cart.items[productIndex].quantity > 1) {
    cart.items[productIndex].quantity -= 1;
  } else {
    // Remove the item if quantity is 0
    cart.items.splice(productIndex, 1);
  }

  if (cart.items.length === 0) {
    await Cart.deleteOne(identifyUserOrGuest);
    return res.status(204).json({
      message: "Cart is empty now",
      success: true,
    });
  }

  await cart.save();

  res.status(200).json({
    message: "Product updated in cart",
    success: true,
    cart,
  });
      
    } 
    catch (error) 
    {
      console.error("Error in removeFromCart:", error.message || error);
      res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
      
};

export const viewCart = async (req, res) => {
  try {
    

    const authenticatedUserId = req.id || null;
    const identifyUserOrGuest = authenticatedUserId
      ? { userDetails: authenticatedUserId }
      : { guestId };

    const cart = await Cart.findOne(identifyUserOrGuest).populate("items.productId");

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
import { Wishlist } from "../../models/user/wishlist.model.js";


export const addOnWishlist = async function (req,res){

  try 
  {
    const {productId} = req.body;

  if (!productId ) {
    return res.status(400).json({
      message: "Product ID are required",
      success: false,
    });
  }

  const authenticatedUserId = req.id || null;
  const identifyUserOrGuest = authenticatedUserId ? { userDetails : authenticatedUserId} : {guestId: req.guestId};


  let wishlist = await Wishlist.findOne(identifyUserOrGuest);

  if(!wishlist)
  {
      wishlist  = new Wishlist({
        ...identifyUserOrGuest,
        items:[],
      });

  }

  const productAlreadyExist = wishlist.items.findIndex((item)=>{
    return item.productId.toString() === productId

  });

  if(productAlreadyExist >= 0)
  {
    return res.status(400).json({
      message: "Product already in wishlist",
      success: false,
    })

  }
  else
  {
    wishlist.items.push({
      productId
    });
  }

  await wishlist.save();

  res.status(200).json({
    message: "Product added to wishlist",
    success: true,
    wishlist,
  });
    
  } 
  catch (error) 
  {
    console.error("Error in addToWishlist:", error.message || error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
    
};

export const removeFromWishlist = async function (req,res){

    try 
    {
      const {productId} = req.body;

    if (!productId ) {
      return res.status(400).json({
        message: "Product ID is required",
        success: false,
      });
    }

    const authenticatedUserId = req.id || null;
    const identifyUserOrGuest = authenticatedUserId ? { userDetails : authenticatedUserId} : {guestId: req.guestId};


    let wishlist = await Wishlist.findOne(identifyUserOrGuest);

    if(!wishlist || wishlist.items.length === 0)
    {
      return res.status(404).json({
           message: "wishlist is empty",
           success: false });

    }

    
  const productIndex = wishlist.items.findIndex(
    (item) =>
      item.productId.toString() === productId
  );

  if (productIndex === -1) {
    return res.status(404).json({
      message: "Product not found in wishlist",
      success: false,
    });
  }

    wishlist.items.splice(productIndex, 1);
  

  await wishlist.save();

  res.status(200).json({
    message: "Product removed from wishlist",
    success: true,
    wishlist,
  });
      
    } 
    catch (error) 
    {
      console.error("Error in removeFromWishlist:", error.message || error);
      res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
      
};

export const viewWishlist = async (req, res) => {
  try {
    const { guestId } = req.body;

    const authenticatedUserId = req.id || null;
    const identifyUserOrGuest = authenticatedUserId
      ? { userDetails: authenticatedUserId }
      : { guestId: req.guestId };

    const wishlist = await Wishlist.findOne(identifyUserOrGuest).populate("items.productId");

    if (!wishlist || wishlist.items.length === 0) {
      return res.status(404).json({
        message: "wishlist is empty",
        success: false,
      });
    }

    res.status(200).json({
      message: "wishlist retrieved successfully",
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("Error in viewWishlist:", error.message || error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
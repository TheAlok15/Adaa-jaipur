import { Product } from "../../models/admin/product.model";


export const addProduct = async (req, res) => {
  try {
    
    const { productId, productName, productDescription, productPrice, productImage, productCategory, productSubCategory, productQuantity, productSizes, productColors } = req.body;

    const { size, quantity} = productSizes || {} 
    
    

    const admin = req.admin;

    if (admin.role !== 'supperAdmin' && admin.role !== 'admin') {
      return res.status(403).json({
        message: "Unauthorized access. Only admins can create categories.",
        success: false,
      });
    }

    const existingProduct= await Product.findOne({ productId });
    if (existingProduct) {
      return res.status(400).json({
        message: "Product already exists.",
        success: false,
      });
    }

    const newProduct = await new Product({
      productId,
      productName,
      productDescription,
      productPrice,
      productImage,

      subCategories: subCategories || [],
      adminId: admin._id, // Link the category to the authenticated admin
    });

    const savedCategory = await newCategory.save();

    return res.status(201).json({
      message: "Category created successfully.",
      category: savedCategory,
      success: true,
    });

  } 
  catch (error) 
  {
    return res.status(500).json({
      message: "An error occurred while creating the category.",
      error: error.message,
      success: false,
    });
  }
};



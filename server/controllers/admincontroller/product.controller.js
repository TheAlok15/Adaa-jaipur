import { Product } from "../../models/admin/product.model.js";
import { Category } from "../../models/admin/category.model.js";
import { SubCategory } from "../../models/admin/subcategory.model.js";
import { getDataUri } from "../../utils/dataUri.js";
import cloudinary from "cloudinary";

export const addProduct = async (req, res) => {
  try {
    const admin = req.admin;
    if (admin.role !== "supperAdmin" && admin.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized access. Only admins can add products.",
        success: false,
      });
    }

    const {
      productId,
      productName,
      productDescription,
      productPrice,
      productCategory,
      productSubCategory,
      productQuantity,
      productSizes,
      productColors,
    } = req.body;

    const productImageFile = req.file;

    // Check if product category exists
    const category = await Category.findById(productCategory);
    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
        success: false,
      });
    }

    // Check if subcategory exists
    const subCategory = await SubCategory.findById(productSubCategory);
    if (!subCategory) {
      return res.status(404).json({
        message: "Subcategory not found.",
        success: false,
      });
    }

    // Check if a product with the given ID already exists
    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      return res.status(400).json({
        message: "Product with this ID already exists.",
        success: false,
      });
    }

    // Upload product image to Cloudinary
    let cloudinaryResponse;
    if (productImageFile) {
      const fileUri = getDataUri(productImageFile);
      cloudinaryResponse = await cloudinary.uploader.upload(fileUri, {
        folder: "products",
      });
    }

    // Create a new product
    const newProduct = new Product({
      productId,
      productName,
      productDescription,
      productPrice,
      productImage: cloudinaryResponse?.secure_url || "", // Use Cloudinary URL
      productCategory: category._id,
      productSubCategory: subCategory._id,
      productQuantity,
      productSizes: JSON.parse(productSizes), // Ensure sizes are parsed correctly
      productColors: JSON.parse(productColors), // Ensure colors are parsed correctly
      adminId: admin._id,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    return res.status(201).json({
      message: "Product added successfully.",
      product: savedProduct,
      success: true,
    });
  } catch (error) {
    console.error("Error in addProduct:", error.message || error);
    return res.status(500).json({
      message: "An error occurred while adding the product.",
      success: false,
      error: error.message,
    });
  }
};

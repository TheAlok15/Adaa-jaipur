import { Category } from "../../models/admin/category.model";


export const addCategory = async (req, res) => {
  try {
    
    const { categoryId, categoryName, subCategories } = req.body;

    const admin = req.admin;

    if (admin.role !== 'superAdmin' && admin.role !== 'admin') {
      return res.status(403).json({
        message: "Unauthorized access. Only admins can create categories.",
        success: false,
      });
    }

    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists.",
        success: false,
      });
    }

    const newCategory = await new Category({
      categoryId,
      categoryName,
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


export const deleteCategory = async (req, res) => {
  try {
    
    const { categoryId, categoryName } = req.body;

    const admin = req.admin;

    if (admin.role !== 'superAdmin' && admin.role !== 'admin') {
      return res.status(403).json({
        message: "Unauthorized access. Only admins can create categories.",
        success: false,
      });
    }

    const query = categoryId ? {categoryId} : {categoryName}
    const existingCategory = await Category.findOne({ query });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category doesn't exists.",
        success: false,
      });
    }

    await Category.deleteOne({existingCategory});

    return res.status(201).json({
      message: "Category deleted successfully.",
      category: savedCategory,
      success: true,
    });

  } 
  catch (error) 
  {
    return res.status(500).json({
      message: "An error occurred while deleting the category.",
      error: error.message,
      success: false,
    });
  }
};



export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      message: "Categories fetched successfully.",
      categories,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while fetching categories.",
      error: error.message,
      success: false,
    });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const { categoryId, categoryName, subCategories } = req.body;
    const admin = req.admin;

    if (admin.role !== "superAdmin" && admin.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized access. Only admins can update categories.",
        success: false,
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { categoryName, subCategories },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        message: "Category not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Category updated successfully.",
      category: updatedCategory,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while updating the category.",
      error: error.message,
      success: false,
    });
  }
};
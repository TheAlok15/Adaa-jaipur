import { Category } from "../../models/admin/category.model.js";
import { SubCategory } from "../../models/admin/subcategory.model.js"

export const addSubCategory = async (req, res) => {
  try {
    
    const { subCategoryId, subCategoryName, categoryId } = req.body;

    const admin = req.admin;

    if (admin.role !== 'supperAdmin' && admin.role !== 'admin') {
      return res.status(403).json({
        message: "Unauthorized access. Only admins can create Subcategories.",
        success: false,
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
        success: false,
      });
    }

    const existingSubCategory = await SubCategory.findOne({ subCategoryName, category: categoryId});

    if (existingSubCategory) {
      return res.status(400).json({
        message: "SubCategory already exists under this category",
        success: false,
      });
    }

    const newSubCategory = await new SubCategory({
      subCategoryId,
      subCategoryName,
      category : category._id,
      adminId: admin._id,
    });

    const savedSubCategory = await newSubCategory.save();

    return res.status(201).json({
      message: " Sub Category created successfully.",
      category: savedSubCategory,
      success: true,
    });

  } 
  catch (error) 
  {
    return res.status(500).json({
      message: "An error occurred while creating the sub category.",
      error: error.message,
      success: false,
    });
  }
};


export const deleteSubCategory = async (req, res) => {
  try {
    
    const { subCategoryId, subCategoryName, categoryId } = req.body;

    const admin = req.admin;

    if (admin.role !== 'supperAdmin' && admin.role !== 'admin') {
      return res.status(403).json({
        message: "Unauthorized access. Only admins can create Subcategories.",
        success: false,
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
        success: false,
      });
    }

    const query = subCategoryId ? {_id : subCategoryId} : {subCategoryName} 

    const existingSubCategory = await SubCategory.findOne({ query });
    if (!existingSubCategory) {
      return res.status(400).json({
        message: "SubCategory doesn't exists.",
        success: false,
      });
    }

    await SubCategory.deleteOne({ _id : existingSubCategory_.id})

    return res.status(201).json({
      message: "Sub Category deleted successfully.",
      success: true,
    });

  } 
  catch (error) 
  {
    return res.status(500).json({
      message: "An error occurred while creating the sub category.",
      error: error.message,
      success: false,
    });
  }
};
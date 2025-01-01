import mongoose from "mongoose";
const { Schema } = mongoose;
const ObjectId = mongoose.ObjectId;

const productSchema = new Schema(
  {
    productId: { type: ObjectId, required: true, unique: true },
    productDescription: { type: String, required: true },
    productQuantity: { type: Number, default: 1 },
    productPrice: { type: Number, required: true },
    productImage: { type: String, default: "" },

    // Category and Subcategory for Filtering
    category: { type: String, enum: ["top", "bottom", "kurta", "dress", "accessories"], required: true },
    subCategory: { type: String, required: true },

    // Stock and Quantity Management
    availableQuantity: { type: Number, required: true, default: 0 },
    soldQuantity: { type: Number, default: 0 },

    // Can be used for UI purposes
    color: [{ type: String }], 
    size: { type: [String], enum: ["S", "M", "L", "XL", "XXL"], default: ["M"] }, 
    admin: { type:ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);

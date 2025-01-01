import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const subCategorySchema = new Schema({
  subCategoryId: { type: Number, required: true, unique: true },
  subCategoryName: { type: String, required: true, unique: true },
  category: { type: ObjectId, ref: "Category", required: true },
  adminId: { type: ObjectId, ref: "Admin", required: true },
}, { timestamps: true });

export const SubCategory = mongoose.model("SubCategory", subCategorySchema);

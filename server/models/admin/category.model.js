import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const categorySchema = new Schema({
  categoryId: { type: Number, required: true, unique: true },
  categoryName: { type: String, required: true, unique: true },
  subCategories: [{ type: ObjectId, ref: "SubCategory" }],
  adminId: { type: ObjectId, ref: "Admin", required: true },
}, { timestamps: true });

export const Category = mongoose.model("Category", categorySchema);

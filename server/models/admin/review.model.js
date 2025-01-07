import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const reviewSchema = new Schema({
  productId: { type: Number, ref: "Product", required: true },
  userId: { type:ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  isApproved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema);

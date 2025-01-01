import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const reviewSchema = new Schema({
  userId: { type: ObjectId, ref: "User", required: true },
  productId: { type: ObjectId, ref: "Product", required: true },
  rating: { type: Number, min: 1, max: 5, default:"" },
  reviewMessage: { type: String, default:"" },
  
},{timestamps:true})

export const Review = mongoose.model("Review", reviewSchema);
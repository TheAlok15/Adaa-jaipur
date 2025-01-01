import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const cartSchema = new Schema({
  userDetails: { type: ObjectId, ref: "User", required: true },
  guestId: { type: String, required: false },
  items: [
    {
      productId: { type: ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1 },
      color: { type: String, required: true },
      size: { type: String, required: true },
      price: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
  ],
  grandTotal: { type: Number, required: true },


},{timestamps:true})

export const Cart = mongoose.model("Cart", cartSchema);
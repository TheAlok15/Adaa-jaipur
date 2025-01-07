import mongoose from "mongoose";
const { Schema, model } = mongoose;

const wishlistSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    guestId: { type: String, required: false },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        productName: {type: String, require: true},
        color: { type: String },
        size: { type: String },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Wishlist = model("Wishlist", wishlistSchema);

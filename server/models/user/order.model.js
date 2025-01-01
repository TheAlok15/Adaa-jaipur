import mongoose from "mongoose";
const { Schema } = mongoose;
const ObjectId = mongoose.ObjectId;

const orderSchema = new Schema(
  {
    userDetails: { type: ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1 },
        size: { type: String, required: true },
        color: { type: String, required: true },
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true }
      },
    ],
    grandTotal: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "failed"],
      default: "unpaid",
    },
    reviewStatus: { type: Boolean, default: false }
  },
  
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  let total = 0;
  this.items.forEach(item => {
    item.totalPrice = item.quantity * item.price; 
    total += item.totalPrice;
  });
  this.grandTotal = total; 
  next();
})

export const Order = mongoose.model("Order", orderSchema);

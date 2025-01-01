import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const orderSchema = new Schema({
  user: { type: ObjectId, ref: 'User', required: true }, // Reference to User
  orderProducts: [{
    productId: { type: ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true }, // price at the time of purchase
  }],
  orderTotalAmount: { type: Number, required: true },
  orderShippingAddress: { 
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'shipped', 'delivered', 'canceled'], 
    default: 'pending' 
  }, // Order status
  orderedAt: { type: Date, default: Date.now }, // Timestamp of order placement
  deliveredAt: { type: Date }, // Timestamp of delivery, if applicable
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);

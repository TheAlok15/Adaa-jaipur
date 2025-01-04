import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const productSchema = new Schema({
  productId:{type:String, require:true, unique:true},
  productName:{type:String, require:true},
  productDescription:{type:String, require:true},
  productPrice:{type:Number, require:true},
  productImage:{type:String, require:true},
  productCategory:{type: ObjectId, ref: 'Category', required: true},
  productSubCategory:{type: ObjectId, ref: 'Subcategory', required: true },
  productQuantity:{type:Number, require:true},
  productSizes: [{
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
  }],
  
  productColors: [{
    color: { type: String, required: true },
    quantity: { type: Number, required: true }, 
  }],
  adminId: { type: ObjectId, ref: "Admin", required: true },



},{timestamps:true});

export const Product = mongoose.model("Product", productSchema);
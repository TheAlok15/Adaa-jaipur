import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const userSchema = new Schema({
  name:{type:String, require:true},
  email:{type:String, require:true, unique:true},
  password:{type:String, require:true},
  profilePicture:{type:ObjectId, default:""},
  cartItems:[{type:ObjectId, ref:"Cart"}],
  wishlistItems:[{type:ObjectId, ref:"Wishlist"}],
  orderItems:[{type:ObjectId, ref:"Order"}],
  reviews:[{type:ObjectId,ref:"Review", default:""}]

},{timestamps:true})

export const User = mongoose.model("User", userSchema);
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const adminSchema = new Schema({
  name:{type:String, require:true},
  email:{type:String, require:true, unique:true},
  password:{type:String, require:true},
  role:{type:ObjectId, enum:["supperAdmin", "admin"], require:true}

},{timestamps:true})

export const Admin = mongoose.model("Admin", adminSchema);
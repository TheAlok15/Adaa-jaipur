import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const adminSchema = new Schema({
  name:{type:String, require:true},
  email:{type:String, require:true, unique:true},
  password:{type:String, require:true},
  role:{type:String, enum:["supperAdmin", "admin"], default:"admin", require:true},
  activityLog:[{
    actionPerformed: { type: String }, // e.g., "Created Product"
      resourceId: { type: mongoose.ObjectId }, // ID of the resource
      resourceType: { type: String }, // e.g., "Product", "Category"
      timestamp: { type: Date, default: Date.now },
  }],
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },


},{timestamps:true})

export const Admin = mongoose.model("Admin", adminSchema);
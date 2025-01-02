import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const adminSchema = new Schema({
  name:{type:String, require:true},
  email:{type:String, require:true, unique:true},
  password:{type:String, require:true},
  role:{type:String, enum:["supperAdmin", "admin"], default:"admin", require:true},
  activityLog:[{
    action:String,
    timestamps:{type:Date, default:Date.now},
    details:{type:Object}
  }],
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },


},{timestamps:true})

export const Admin = mongoose.model("Admin", adminSchema);
import mongoose from "mongoose";


export const dbConnect = async ()=>{

  try 
  {
     await mongoose.connect(process.env.MONGO_URI);

    console.log("Mongo db connected");
    
    
  } catch (error) 
  {
    console.log("Error in mongodb connection ", error.message || error);
    
    
  }
}
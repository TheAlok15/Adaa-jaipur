import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnect } from "./database/dbConnect.js"


const app = express();

app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods:["GET", "POST", "PUT", "DELETE"],
    credentials:true
}));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

app.use("/api/v1/collection/")


dbConnect();
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
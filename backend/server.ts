import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const mongoUri=process.env.MONGO_URI||"";
const port=process.env.PORT||3000;

mongoose.
connect(mongoUri)
.then(()=>console.log("Connected to MongoDb Atlas"))
.catch((err)=>console.error("MongoDb connection Error",err));

app.use("/", authRoutes);

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("/api/auth", userRoutes);

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));

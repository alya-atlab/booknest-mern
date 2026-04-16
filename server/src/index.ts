import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";

dotenv.config();

const app = express();

app.use(express.json());
const PORT = process.env.PORT as string;

connectDB();
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.listen(PORT, () => console.log(`API running on ${PORT}`));

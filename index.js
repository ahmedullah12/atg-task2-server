import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserRouter } from "./routes/user.js";
import { PostRouter } from "./routes/posts.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;


app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
app.use(cookieParser());

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ttiygsx.mongodb.net/atg-task2`);

app.use('/auth', UserRouter);
app.use('/posts', PostRouter);


app.get("/", (req, res) => {
    res.send("Server is running");
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
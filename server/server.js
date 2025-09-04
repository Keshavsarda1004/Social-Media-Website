import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import connectDB from './configs/db.js';
import { serve } from "inngest/express";
import userRouter from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import { inngest, functions } from "./inngest/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(express.urlencoded({extended : true}));

app.get("/", (req, res) => {
    res.send("API is working");
})
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", userRouter);

app.listen(PORT, () => {
    console.log(`App is running on port : ${PORT}`);
})
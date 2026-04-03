import express from "express";
import cors from "cors";
import {clerkMiddleware} from "@clerk/express";

import userRoutes from "./routes/user.route.js"

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("Hello from server"));

app.use("/api/users", userRoutes);

const startServer = async () => {
    try {
        await connectDB();// will not start listening to port until Db connection succeeds.
    } catch (error) {
        console.error("Failed to connect to database:", error.message);
        process.exit(1);
    }

    const server = app.listen(ENV.PORT, () => {
        console.log('Server is up and running at PORT: ${ENV.PORT}')
    });
    server.on("error", (error) => {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    });
};

startServer();


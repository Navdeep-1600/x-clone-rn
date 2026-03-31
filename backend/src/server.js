import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

app.get("/", (req, res) => res.send("Hello from server"));

const startServer = async () => {
    try {
        await connectDB();
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


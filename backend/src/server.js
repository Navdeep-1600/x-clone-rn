import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

app.get("/", (req, res) => res.send("Hello from server"));

const startServer = async () => {
    await connectDB();

    const server = app.listen(ENV.PORT, () => {
        console.log('Server is up and running at PORT: ${ENV.PORT}')
    });
    server.on("error", (error) => {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    });
};

startServer();


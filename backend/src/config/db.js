import mongoose from "mongoose";
import { ENV } from "./env.js";


export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI)
        console.log("Connected to DB succesfully")
        
    } catch (error) {
        console.log("Error Connecting to MongoDB")
        process.exit(1)
    }
} 
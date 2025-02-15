import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";
console.log("Starting database connection...");
if (!DB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.<development/production>.local');
}
const connectToDatabase = async () => {
    console.log("Attempting to connect to MongoDB...");
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to database in ${NODE_ENV} mode`);
    } catch (error) {
        console.error('Error connecting to database: ', error);

        process.exit(1);
    }
}

export default connectToDatabase;
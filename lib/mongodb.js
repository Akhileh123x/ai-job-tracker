// lib/mongodb.js
import { MongoClient } from "mongodb";
import mongoose from "mongoose"; // 1. Import mongoose

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("Please add your MONGODB_URI environment variable to your .env.local file");
}

let client;
let db;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  client = await global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  await client.connect();
}

db = client.db();

/**
 * Legacy wrapper function to support Server Actions expecting 
 * a connectToDatabase() routine.
 */
export async function connectToDatabase() {
  // 2. Connect Mongoose if it isn't already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      bufferCommands: false, // Disables the infinite buffering loop so it throws instantly if disconnected
    });
  }
  
  return { client, db };
}

export { client, db };
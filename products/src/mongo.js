import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let client;
let db;

export async function getDB() {
  if (db) return db;

  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
  }

  await client.connect();

  const dbName = process.env.MONGO_DB_NAME || "auth_db";
  db = client.db(dbName);

  console.log("✅ Connected to MongoDB DB:", dbName);
  return db;
}

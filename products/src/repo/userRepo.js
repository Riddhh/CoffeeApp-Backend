import { getDB } from "../mongo.js";

export async function findUserByEmail(email) {
  const db = await getDB();
  return db.collection("users").findOne({ email });
}

export async function insertUser(user) {
  const db = await getDB();
  return db.collection("users").insertOne(user);
}

import { getDB } from "../mongo.js";

export async function findUserByEmail(email) {
  const db = await getDB();
  return db.collection("users").findOne({ email });
}

export async function insertUser(user) {
  const db = await getDB();
  return db.collection("users").insertOne(user);
}

export async function findUserById(id) {
  const db = await getDB();
  // if you want /me to return email, easiest is store sub as string and query by _id using ObjectId,
  // but to keep it simple: we’ll just return payload values in /me for now in middleware route.
  return null;
}

import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const client = new MongoClient(MONGODB_URI);

export const connectDB = async () => {
  if (!client.topology) {
    await client.connect();
  }
  return client.db(); // Database name is already in the URI
};

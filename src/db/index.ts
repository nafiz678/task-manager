import { MongoClient, Db, ServerApiVersion } from "mongodb";


const uri = `${process.env.MONGODB_URI}`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db: Db | null = null;

export async function connectDB(): Promise<Db> {

  if (!db) {
    await client.connect();
    db = client.db("Task-Manager");
  }

  try {
    await client.connect();
    const database = client.db("Task-Manager"); 

    console.log("Connected to MongoDB");
    // Should show "collections"

    return database;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

export { client };
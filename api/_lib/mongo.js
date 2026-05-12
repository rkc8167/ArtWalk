import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
 // Tune these for serverless
 maxPoolSize: 10,
 minPoolSize: 0,
 serverSelectionTimeoutMS: 5000,
}

if (!uri) {
 throw new Error('Missing MONGODB_URI environment variable')
}

let client
let clientPromise

async function createIndexes(mongoClient) {
 const db = mongoClient.db('awDB')
 await db.collection('users').createIndex({ email: 1 }, { unique: true })
 await db.collection('users').createIndex({ createdAt: -1 })
    await db.collection('installations').createIndex({createdAt: -1})
}

// Cache the connection across invocations.
// In serverless, the module-level scope persists between
// "warm" invocations on the same instance.
if (!global._mongoClientPromise) {
 client = new MongoClient(uri, options)
 global._mongoClientPromise = client.connect().then(async (c) => {
  await createIndexes(c)
  return c
 })
}
clientPromise = global._mongoClientPromise

export default clientPromise

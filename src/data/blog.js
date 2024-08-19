import { MongoClient, ObjectId } from 'mongodb';

const mongoURI = 'yourMongoURI'; // Replace with your actual MongoDB URI
const dbName = 'yourDBName';     // Replace with your actual database name
const collectionName = 'blogs';

let dbClient;

async function connectToDb() {
    if (!dbClient) {
        dbClient = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await dbClient.connect();
    }
    return dbClient.db(dbName);
}

export async function getAllBlogs() {
    const db = await connectToDb();
    return db.collection(collectionName).find({}).toArray();
}

export async function getBlogById(id) {
    const db = await connectToDb();
    return db.collection(collectionName).findOne({ _id: new ObjectId(id) });
}

export async function createBlog(title, content) {
    const db = await connectToDb();
    const newBlog = { title, content };
    const result = await db.collection(collectionName).insertOne(newBlog);
    return result.insertedId;
}

export async function updateBlog(id, title, content) {
    const db = await connectToDb();
    const updatedBlog = { title, content };
    await db.collection(collectionName).updateOne({ _id: new ObjectId(id) }, { $set: updatedBlog });
    return await getBlogById(id);
}

export async function deleteBlog(id) {
    const db = await connectToDb();
    await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
    return true;
}

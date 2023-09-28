import { MongoClient } from "mongodb";
import {configDotenv} from "dotenv";

configDotenv()

const connectionString = process.env.MONGO_URI;

const client = new MongoClient(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
let conn;

try {
    conn = await client.connect();
} catch (e) {
    console.error(e)
}
// export conn
let db = conn.db('Database')

export default db

// async function connectToDB() {
//     const client = new MongoClient(connectionString, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
//
//     try {
//         await client.connect();
//         return client.db('Database');
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }
//
// export default connectToDB;
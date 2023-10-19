import { MongoClient } from "mongodb";
import {configDotenv} from "dotenv";

configDotenv()

const connectionString = process.env.MONGO_URI;

const client = new MongoClient(connectionString);
let conn;

try {
    conn = await client.connect();
} catch (e) {
    console.error(e)
}
// export conn
let db = conn.db('Database')

export default db

// const connectionString = process.env.MONGO_URI
//
// const client = new MongoClient(connectionString, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//
// let conn
// let db
//
// async function initialize() {
//     try {
//         conn = await client.connect()
//         db = conn.db('Database')
//     } catch (e) {
//         console.error(e)
//     }
// }
//
// initialize().then(() => {
//     console.log("Database initialized")})
//
// export default db

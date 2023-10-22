import db from "../db/conn.js";

export async function serverHealthCheck(req, res) {
  try {
    await db.collection('User').find().limit(1).toArray();
    console.log("Server healthy!")
    return res.send({ message: "Server and database connection are up and running!" });
  } catch (error) {
    return res.status(500).send({ message: "Error connecting to the database", error: error.toString() });
  }
}

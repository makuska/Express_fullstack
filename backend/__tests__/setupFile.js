import { MongoClient } from "mongodb"

let client;

beforeAll(async () => {
  const uri = process.env.MONGO_URI;
  if (uri === undefined) {
    throw Error("Where is URI?");
  }
  client = await MongoClient.connect(uri);
});

afterAll(async () => {
  if (client) {
    await client.close();
  }
});

export default client

import { MongoClient } from "mongodb"
import {configDotenv} from "dotenv"

configDotenv()

describe('insert', () => {
  const {MONGO_URI} = process.env
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(MONGO_URI);
    db = await connection.db(MONGO_URI);
  });

  afterAll(async () => {
    await connection.close();
  });

  describe("POST User collection", () => {
    it('should insert a user into collection', async () => {
      const users = db.collection('User')

      const mockUser = {
        username: 'testUsername',
        email: 'test@email.com',
        role: 'user',
        password: 'somePassword'
      }
      await users.insertOne(mockUser)

      const insertedUser = await users.findOne({username: mockUser.username});
      expect(insertedUser).toEqual(mockUser);
    });
  })

})




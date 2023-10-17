import {MongoClient, ObjectId} from "mongodb"
import {configDotenv} from "dotenv"

configDotenv()

describe('insert', () => {
  const {MONGO_URI} = process.env
  let connection;
  let db;
  const startTime = new ObjectId();

  async function cleanUpDatabase() {
    await db.collection('User').deleteMany({ _id: {$gt: startTime} })
  }

  beforeAll(async () => {
    connection = await MongoClient.connect(MONGO_URI);
    db = await connection.db(MONGO_URI);
  });

  afterAll(async () => {
    setTimeout(async () => {
      await cleanUpDatabase()
        .then(() => {console.log("Test data cleared from the Database")})
    }, 1000)

    await connection.close()
  });

  describe("POST user", () => {
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

  // tbh this is unnecessary since there is no special need to test the database itself?
  describe('GET user', () => {
    it('should get a user from the collection', async () => {
      const username = 'testUsername'
      const users = db.collection('User')

      const userFromCollection = await users.findOne({ username: username})
      expect(userFromCollection).toHaveProperty(['_id', 'username', 'email', 'role', 'password'])
    });
  });

})




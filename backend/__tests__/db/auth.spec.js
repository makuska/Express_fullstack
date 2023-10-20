import {MongoClient, ObjectId} from "mongodb"
import {configDotenv} from "dotenv"
import { expect } from 'chai'
import { describe, it } from 'mocha'


configDotenv();

describe('Testing mongodb from a container', () => {
  const { MONGO_USERNAME, MONGO_PASSWORD } = process.env;
  const mongoConnectionString = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mymongodb:27017?authMechanism=DEFAULT&authSource=admin&connectTimeoutMS=180000&socketTimeoutMS=720000&serverSelectionTimeoutMS=180000`
  let connection;
  let db;
  const startTime = new ObjectId();

  async function cleanUpDatabase() {
    await db.collection('User').deleteMany({ _id: { $gt: startTime } });
  }

  before(async function() {
    this.timeout(5000); // Set timeout to 5000ms
    connection = await MongoClient.connect(mongoConnectionString);
    db = await connection.db('Database');
    // setTimeout(done, 2000);
  });


  after(async function() {
    if (db) {
      await cleanUpDatabase();
      console.log("Test data cleared from the Database");
    }
    if (connection) {
      await connection.close();
    }
  });

  describe("POST user", function() {
    it('should insert a user into collection', async function() {
      const users = db.collection('User');

      const mockUser = {
        username: 'testUsername',
        email: 'test@email.com',
        role: 'user',
        password: 'somePassword'
      };
      await users.insertOne(mockUser);

      const insertedUser = await users.findOne({username: mockUser.username});
      expect(insertedUser).to.include({
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role
      });
    });
  });

  describe('GET user', function() {
    it('should get a user from the collection', async function() {
      const username = 'testUsername';
      const users = db.collection('User');

      const userFromCollection = await users.findOne({ username: username});
      expect(userFromCollection).to.have.property('_id');
      expect(userFromCollection).to.have.property('username');
      expect(userFromCollection).to.have.property('email');
      expect(userFromCollection).to.have.property('role');
      expect(userFromCollection).to.have.property('password');
    });
  });
});


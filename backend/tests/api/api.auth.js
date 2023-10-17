import {configDotenv} from "dotenv"
import db from '../../db/conn.js'
import {ObjectId} from "mongodb";

configDotenv()

// function objectIdWithTimestamp(timestamp) {
//   /* Convert string date to Date object (otherwise assume timestamp is a date) */
//   if (typeof(timestamp) == 'string') {
//     timestamp = new Date(timestamp);
//   }
//
//   /* Convert date object to hex seconds since Unix epoch */
//   let hexSeconds = Math.floor(timestamp/1000).toString(16);
//
//   /* Create an ObjectId with that hex timestamp */
//   let constructedObjectId = ObjectId(hexSeconds + "0000000000000000");
//
//   return constructedObjectId
// }

describe('POST auth requests', () => {
  const baseURL = 'http://localhost:8080'
  const startTime = new ObjectId();

  async function cleanUpDatabase() {
    await db.collection('User').deleteMany({ _id: {$gt: startTime} })
  }

  afterAll(() => {
    // timeout of 1sec just in case
    setTimeout(async () => {
      await cleanUpDatabase()
        .then(() => {console.log("Test data cleared from the Database")})
    }, 1000)
  })

  describe("POST /api/auth/signin", () => {
    it('should insert a user into collection', async () => {
      const mockUser = {
        username: 'testUsername',
        email: 'test@email.com',
        role: 'user',
        password: '@TestingPassword123'
      }

      const response = await fetch(`${baseURL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type
        },
        body: JSON.stringify(mockUser), // Convert your user object to a JSON string
      });

      expect(response.status).toBe(201)
    });
  })

  // TODO should use another user, because this test depends on the first test.
  describe("POST /api/auth/signin", () => {
    it('should return resUser, accessToken and refreshToken', async () => {
      const mockUser = {
        username: 'testUsername',
        password: '@TestingPassword123'
      }

      const response = await fetch(`${baseURL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockUser),
      })

      expect(response.status).toBe(200)

      const responseBody = await response.json()
      expect(responseBody).toHaveProperty('resUser')
      expect(responseBody).toHaveProperty('accessToken')
      expect(responseBody).toHaveProperty('refreshToken')

      const expectedResUser = {
        username: 'testUsername',
        email: 'test@email.com',
        role: 'user',
      };

      expect(responseBody.resUser).toMatchObject(expectedResUser)
      // Since both JWT's use the same hashing algorithm it will always return this header
      expect(responseBody.accessToken).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/)
      expect(responseBody.refreshToken).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/)
    });
  })

  describe("POST /api/auth/signin", () => {
    it('should fail the signUp schema', async () => {
      const mockUser = {
        username: 'testUsername',
        email: 'test@email.com',
        role: 'user',
        password: 'failingPassword'
      }

      const response = await fetch(`${baseURL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type
        },
        body: JSON.stringify(mockUser), // Convert your user object to a JSON string
      });

      expect(response.status).toBe(422)
    });
  })

})




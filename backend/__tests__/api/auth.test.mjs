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

  // Insert a test user, which will be used for testing
  async function returnTestUser() {
    const mockUser = {
      username: 'testUsername',
      email: 'test@email.com',
      role: 'user',
      password: '@TestingPassword123'
    }

    const result = await db.collection('User').insertOne(mockUser)
    if (result.insertedId) {
      return mockUser
    } else {
      throw Error("Unable to insert a test user to the database!")
    }
  }

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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockUser)
      });

      expect(response.status).toBe(201)
    });

    
    it('should return resUser, accessToken and refreshToken', async () => {
      const mockUser = await returnTestUser()
      const validUser = {
        username: mockUser.username,
        password: mockUser.password
      }

      const response = await fetch(`${baseURL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validUser),
      })

      expect(response.status).toBe(200)
      expect(response.headers).toHaveProperty('Auhtorization')

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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockUser)
      });

      expect(response.status).toBe(422)
    });
  })

  describe('GET /isUser', () => {
    it('should return user protected resources', async () => {
      const mockUser = await returnTestUser()
      const validUser = {
        username: mockUser.username,
        password: mockUser.password
      }

      const response = await fetch(`${baseURL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validUser),
      })

      if (response.status === 200) {
        const res = await fetch(`${baseURL}/isUser`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        expect(res.status).toBe(200)
        const responseBody = await res.json()
        expect(Array.isArray(responseBody)).toBe(true)
        expect(responseBody[0]).toHaveProperty('_id')
        expect(responseBody[0]).toHaveProperty('name')
        expect(responseBody[0]).toHaveProperty('description')
        expect(responseBody[0]).toHaveProperty('date')
      }
      expect(response.status).toBe(200)

    });
  });

})
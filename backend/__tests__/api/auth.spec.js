import { configDotenv } from "dotenv";
import db from '../../db/conn.js';
import { ObjectId } from "mongodb";
import {expect} from "chai";
import fetch from "node-fetch";


configDotenv();

describe('POST auth requests', () => {
  const baseURL = 'http://backend:8080';
  const startTime = new ObjectId();

  async function cleanUpDatabase() {
    await db.collection('User').deleteMany({ _id: { $gt: startTime } });
  }

  after(async () => {
    // Timeout of 1 second just in case
    await new Promise(resolve => setTimeout(resolve, 1000));
    await cleanUpDatabase();
    console.log("Test data cleared from the Database");
  });

  // Insert a test user, which will be used for testing
  async function returnTestUser() {
    const mockUser = {
      username: 'testUsername',
      email: 'test@email.com',
      role: 'user',
      password: '@TestingPassword123',
    };

    const result = await db.collection('User').insertOne(mockUser);
    if (result.insertedId) {
      return mockUser;
    } else {
      throw new Error("Unable to insert a test user to the database!");
    }
  }

  describe("POST /api/auth/signup", () => {
    it('should insert a user into collection', async () => {
      const mockUser = {
        username: 'testUsername',
        email: 'test@email.com',
        role: 'user',
        password: '@TestingPassword123',
      };

      const response = await fetch(`${baseURL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockUser)
      });

      expect(response.status).to.equal(201)

      const responseBody = await response.json()

      if (response.status === 201) {
        expect(responseBody).to.have.property('message').equal('User registered successfully')
      } else {
        // Error case assertions
        expect(response.status).to.equal(500)
        expect(responseBody.message).to.satisfy((message) => {
          return message === 'An error occurred!!' || message === 'User details validation failed';
        });
      }

    });

    it('should login the user and return resUser, accessToken, and refreshToken', async () => {
      const mockUser = await returnTestUser();
      const validUser = {
        username: mockUser.username,
        password: mockUser.password,
      };

      const expectedResUser = {
        username: 'testUsername',
        email: 'test@email.com',
        role: 'user',
      };

      const response = await fetch(`${baseURL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validUser),
      })

      expect(response.status).to.equal(200);
      const responseBody = await response.json();

      expect(response.headers.get('Authorization')).to.exist;

      expect(responseBody).to.have.property('resUser');
      expect(responseBody).to.have.property('accessToken');
      expect(responseBody).to.have.property('refreshToken');

      expect(responseBody.resUser).to.include({
        username: expectedResUser.username,
        email: expectedResUser.email,
        role: expectedResUser.role
      });

      // Since both JWTs use the same hashing algorithm, they will always start with the same value
      expect(responseBody.accessToken).to.match(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/);
      expect(responseBody.refreshToken).to.match(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/);

    });

    it('should fail the signUp schema', async () => {
      const mockUser = {
        username: 'testUsername',
        email: 'test@email.com',
        role: 'user',
        password: 'failingPassword',
      };

      const response = await fetch(`${baseURL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockUser),
      });

      expect(response.status).to.equal(422);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should login the user and logout the user using valid credentials', async () => {
      const mockUser = await returnTestUser();
      const validUser = {
        username: mockUser.username,
        password: mockUser.password,
      };

      const response = await fetch(`${baseURL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(validUser)
      })

      expect(response.status).to.equal(200);
      if (response.status === 200) {
        const res = await fetch(`${baseURL}/api/auth/logout`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        expect(res.status).to.equal(204)
      }
    });
  });

  // Since the cookie is httpOnly, it's not possible to test the verification of it.
  describe('GET /api/auth/verifyRefreshToken', () => {
    it('should verify the refreshToken', async () => {
      const mockUser = await returnTestUser();
      const validUser = {
        username: mockUser.username,
        password: mockUser.password,
      };

      const response = await fetch(`${baseURL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(validUser)
      })

      expect(response.status).to.equal(200);
      if (response.status === 200) {
        const res = await fetch(`${baseURL}/api/auth/verifyRefreshToken`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })

        expect(res.status).to.equal(401)
      }
    });
  });

  describe('GET /isUser', () => {
    it('should return user-protected resources', async () => {

      const mockUser = await returnTestUser();
      const validUser = {
        username: mockUser.username,
        password: mockUser.password,
      };

      const response = await fetch(`${baseURL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validUser),
      });
      expect(response.status).to.equal(200)

      if (response.status === 200) {
        const res = await fetch(`${baseURL}/isUser`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${response.headers.get('authorization')}`
          },
        });

        expect(res.status).to.equal(200);
        const responseBody = await res.json();
        expect(responseBody).to.be.an('array');
        expect(responseBody[0]).to.have.property('_id');
        expect(responseBody[0]).to.have.property('name');
        expect(responseBody[0]).to.have.property('description');
        expect(responseBody[0]).to.have.property('date');
      }
      expect(response.status).to.equal(200);
    });
  });
});

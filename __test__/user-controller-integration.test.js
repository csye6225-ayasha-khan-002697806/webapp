import dotenv from 'dotenv';
import { expect } from 'chai';
import supertest from 'supertest';
import express from 'express';
import { Buffer } from 'buffer';
import { getUser, updateUser, createUser } from '../controller/user-controller.js'; // Adjust the path as necessary
import { captureRejectionSymbol } from 'events';
import checkAuthenticatedUser from '../middleware/user-auth-service.js'

dotenv.config();
const app = express();
app.use(express.json());

// Define your routes
app.post('/v1/user/', createUser);
app.get('/v1/user/self', checkAuthenticatedUser, getUser);
app.put('/v1/user/self', checkAuthenticatedUser, updateUser);

const request = supertest(app);

function encodeBasicAuth(username, password) {
  return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
}

describe('User Endpoint Integration Tests', () => {
  const testUsername = 'ann.doe@example.com';
  const testPassword = 'skdjfhskdfjhg';
  const newTestPassword = 'skdjfhskdfjhg';

  it('Test 1 - Create an account and get it', async () => {
    try {

      console.log("inside post test");
      await request.post('/v1/user/').send({
        
        first_name: 'Jan',
        last_name: 'Doe',
        email: testUsername,
        password: testPassword,
      });

      console.log("test post : user created");
      const authHeader = encodeBasicAuth(testUsername, testPassword);
      console.log(`username ${testUsername} and testPassword ${testPassword}`);
      console.log(` authHeader: ${authHeader}`);
      const getResponse = await request.get('/v1/user/self').set('Authorization', authHeader);
      

      console.log(getResponse.text);
      const responseBody = getResponse.body; 

      expect(getResponse.statusCode).to.equal(200);
      expect(responseBody.email).to.equal(testUsername); 
    } catch (error) {
      console.error('Test 1 failed:', error.message);
      process.exit(1);
    }
  });

  it('Test 2 - Update the account and get it', async () => {
    try {
      const authHeader = encodeBasicAuth(testUsername, testPassword);
      const updatePayload = {
        first_name: 'Jannie',
        last_name: 'Doey',
        password: newTestPassword,
        email:'ann.doe@example.com'
      };

      const updateResponse = await request.put('/v1/user/self')
        .send(updatePayload)
        .set('Authorization', authHeader);

      expect(updateResponse.statusCode).to.satisfy((code) => code >= 200 && code < 300, 'Update failed');

      const newAuthHeader = encodeBasicAuth(testUsername, newTestPassword);
      const getResponse = await request.get('/v1/user/self').set('Authorization', newAuthHeader);

      expect(getResponse.statusCode).to.equal(200);

      const responseBody = getResponse.body; 

      console.log(responseBody);
      expect(responseBody.email).to.equal(testUsername); 
    } catch (error) {
      console.error('Test 2 failed:', error.message);
      process.exit(1);
    }
  });

  it('Test 3 - Fail to create an account with invalid email', async () => {
    try {
      const invalidEmail = 'invalidemail@@';
      const postResponse = await request.post('/v1/user/').send({
        first_name: 'Jan',
        last_name: 'Doe',
        email: invalidEmail, 
        password: testPassword,
      });

      expect(postResponse.statusCode).to.equal(400); 
      console.log('Test 3 passed: Invalid email response received as expected.');
    } catch (error) {
      console.error('Test 3 failed:', error.message);
      process.exit(1);
    }
  });

  it('Test 4 - Fail to update account with missing required fields', async () => {
    try {
      const authHeader = encodeBasicAuth(testUsername, testPassword);
      const updatePayload = {
        // Missing first_name and last_name
        first_name:'',
        last_name:'',
        password: newTestPassword,
        email: 'ann.doe@example.com'
      };

      const updateResponse = await request.put('/v1/user/self')
        .send(updatePayload)
        .set('Authorization', authHeader);

      expect(updateResponse.statusCode).to.equal(400);
      console.log('Test 4 passed: Missing required fields response received as expected.');
    } catch (error) {
      console.error('Test 4 failed:', error.message);
      process.exit(1);
    }
  });

  it('Test 5 - Fail to update account with invalid email', async () => {
    try {
      const authHeader = encodeBasicAuth(testUsername, testPassword);
      const updatePayload = {
        first_name: 'Jannie',
        last_name: 'Doey',
        password: newTestPassword,
        email: 'invalidemail@@', 
      };

      const updateResponse = await request.put('/v1/user/self')
        .send(updatePayload)
        .set('Authorization', authHeader);

      expect(updateResponse.statusCode).to.equal(400); 
      console.log('Test 5 passed: Invalid email response received as expected.');
    } catch (error) {
      console.error('Test 5 failed:', error.message);
      process.exit(1);
    }
  });

  it('Test 6 - Successfully get user account', async () => {
    try {
      const authHeader = encodeBasicAuth(testUsername, testPassword);
      const getResponse = await request.get('/v1/user/self').set('Authorization', authHeader);
      
      console.log(getResponse.text);
      const responseBody = getResponse.body;

      expect(getResponse.statusCode).to.equal(200);
      expect(responseBody.email).to.equal(testUsername); 
      expect(responseBody.first_name).to.equal('Jannie'); 
      expect(responseBody.last_name).to.equal('Doey'); 
    } catch (error) {
      console.error('Test 1 failed:', error.message);
      process.exit(1);
    }
  });

  after(() => {
    process.exit(0); 
  });
});

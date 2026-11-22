import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Delete Salesforce Account', async ({ request }) => {


  const authResponse = await request.post(
    `${process.env.SALESFORCE_INSTANCE_URL}/services/oauth2/token`,
    {
      form: {
        grant_type: 'client_credentials',
        client_id: process.env.SALESFORCE_CLIENT_ID!,
        client_secret: process.env.SALESFORCE_CLIENT_SECRET!
      }
    }
  );

  expect(authResponse.ok()).toBeTruthy();

  const { access_token } = await authResponse.json();

  const headers = {
    Authorization: `Bearer ${access_token}`
  };


  const createResponse = await request.post(
    `${process.env.SALESFORCE_INSTANCE_URL}/services/data/v64.0/sobjects/Account`,
    {
      headers,
      data: {
        Name: `Playwright DELETE Test ${Date.now()}`
      }
    }
  );

  expect(createResponse.status()).toBe(201);

  const { id: accountId } = await createResponse.json();

  expect(accountId).toBeTruthy();

  
  const response = await request.delete(
    `${process.env.SALESFORCE_INSTANCE_URL}/services/data/v64.0/sobjects/Account/${accountId}`,
    { headers }
  );

  console.log('DELETE Status:', response.status());

  expect(response.status()).toBe(204);

  
  const getResponse = await request.get(
    `${process.env.SALESFORCE_INSTANCE_URL}/services/data/v64.0/sobjects/Account/${accountId}`,
    { headers }
  );

  expect(getResponse.status()).toBe(404);

});


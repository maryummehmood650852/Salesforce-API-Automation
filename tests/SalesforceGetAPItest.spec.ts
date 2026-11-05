import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Get Salesforce Account', async ({ request }) => {

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

  console.log('Auth status:', authResponse.status());

  const authData = await authResponse.json();

  if (!authResponse.ok()) {
    console.log('Auth error:', {
      error: authData.error,
      error_description: authData.error_description
    });
  }

  expect(authResponse.ok()).toBeTruthy();

  const accessToken = authData.access_token;

  
  const createResponse = await request.post(
    `${process.env.SALESFORCE_INSTANCE_URL}/services/data/v64.0/sobjects/Account`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      data: {
        Name: `Playwright GET Test ${Date.now()}`
      }
    }
  );

  expect(createResponse.status()).toBe(201);

  const createData = await createResponse.json();
  const accountId = createData.id;


  const response = await request.get(
    `${process.env.SALESFORCE_INSTANCE_URL}/services/data/v64.0/sobjects/Account/${accountId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  console.log('GET Status:', response.status());

  const data = await response.json();

  expect(response.status()).toBe(200);
  expect(data.Id).toBe(accountId);

  
  const deleteResponse = await request.delete(
    `${process.env.SALESFORCE_INSTANCE_URL}/services/data/v64.0/sobjects/Account/${accountId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  expect(deleteResponse.status()).toBe(204);
});

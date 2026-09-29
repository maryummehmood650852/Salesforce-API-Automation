import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Create Salesforce Account', async ({ request }) => {

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

  const authData = await authResponse.json();

  const accessToken = authData.access_token;

  const response = await request.post(
    `${process.env.SALESFORCE_INSTANCE_URL}/services/data/v64.0/sobjects/Account`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      data: {
        Name: 'MARYUM MEHMOOD'
        
      }
    }
  );

  console.log('Status:', response.status());

  const data = await response.json();

  console.log(data);

  expect(response.status()).toBe(201);
  expect(data.success).toBeTruthy();
  expect(data.id).toBeTruthy();
});
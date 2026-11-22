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

  const { access_token } = await authResponse.json();

  
  const response = await request.post(
    `${process.env.SALESFORCE_INSTANCE_URL}/services/data/v64.0/sobjects/Account`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      data: {
        Name: 'MARYUM MEHMOOD'
      }
    }
  );

  const data = await response.json();

  console.log('Status:', response.status());
  console.log('Response:', data);

 
  expect(response.status()).toBe(201);
  expect(data.success).toBeTruthy();
  expect(data.id).toBeTruthy();
});

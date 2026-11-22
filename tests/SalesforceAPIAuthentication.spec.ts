import { test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Salesforce API Authentication', async ({ request }) => {

  const response = await request.post(
    `${process.env.SALESFORCE_INSTANCE_URL}/services/oauth2/token`,
    {
      form: {
        grant_type: 'client_credentials',
        client_id: process.env.SALESFORCE_CLIENT_ID!,
        client_secret: process.env.SALESFORCE_CLIENT_SECRET!
      }
    }
  );

   console.log('Status:', response.status());

  expect(response.ok()).toBeTruthy();

  const data = await response.json();

  console.log('Access Token:', data.access_token);

  expect(data.access_token).toBeTruthy();
});

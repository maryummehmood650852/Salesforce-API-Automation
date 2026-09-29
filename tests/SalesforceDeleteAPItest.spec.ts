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

  const authData = await authResponse.json();

  const accessToken = authData.access_token;

  const accountId = '001g500000hwkR8AAI';

  const response = await request.delete(
    `${process.env.SALESFORCE_INSTANCE_URL}/services/data/v64.0/sobjects/Account/${accountId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  console.log('Status:', response.status());

  expect(response.status()).toBe(204);
});
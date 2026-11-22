import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Update Salesforce Account', async ({ request }) => {

  
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

  
  const response = await request.patch(
    `${process.env.SALESFORCE_INSTANCE_URL}/services/data/v64.0/sobjects/Account/${process.env.SALESFORCE_ACCOUNT_ID}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      data: {
        Name: 'MARYUM UPDATED'
      }
    }
  );

  console.log('PATCH Status:', response.status());

  if (!response.ok()) {
    console.log('Error:', await response.text());
  }

  expect(response.status()).toBe(204);
});



  

  

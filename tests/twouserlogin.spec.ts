import { test, expect } from '@playwright/test';
import { waitForDebugger } from 'inspector';

test('two users login with OTP autofill in separate contexts', async ({ browser }) => {
  // Create two separate browser contexts
  const ctxA = await browser.newContext();
  const ctxB = await browser.newContext();

  const pageA = await ctxA.newPage();
  const pageB = await ctxB.newPage();

  // User credentials
  const userA = {
    email: 'vipul.qa1@gmail.com',
    password: 'Kmp@123456',
  };
  const userB = {
    email: 'vipul.stage@gmail.com',
    password: 'Kmp@123456',
  };

  // Navigate both users to login page
  await Promise.all([
    pageA.goto('https://dev.app.rukkor.com/login'),
    pageB.goto('https://dev.app.rukkor.com/login'),
  ]);

  // Fill login forms
  await pageA.fill('[data-cy="cy_email"]', userA.email);
  await pageA.fill('[data-cy="cy_password"]', userA.password);

  await pageB.fill('[data-cy="cy_email"]', userB.email);
  await pageB.fill('[data-cy="cy_password"]', userB.password);

  // Click Sign-in buttons
  await Promise.all([
    pageA.click('[data-cy="cy_login"]'),
    pageB.click('[data-cy="cy_login"]'),
  ]);

  // Fill OTP "123456" for both users
  const otp = "123456";

  for (let i = 0; i < otp.length; i++) {
    await pageA.fill(`//input[@aria-label="OTP Input ${i + 1}"]`, otp[i]);
    await pageB.fill(`//input[@aria-label="OTP Input ${i + 1}"]`, otp[i]);   
        
  }  

  // Verify login by checking URL
  await Promise.all([
    expect(pageA).toHaveURL('https://dev.app.rukkor.com/contact/my-contacts', { timeout: 600000 }),
    expect(pageB).toHaveURL('https://dev.app.rukkor.com/contact/my-contacts', { timeout: 600000 }),
  ]);

  console.log('Both users logged in successfully!');

  // Optional: Navigate to Members or Conversation pages
  const membersUrl = 'https://dev.app.rukkor.com/space/2300/flow/9816/conversation';
  await Promise.all([
    pageA.goto(membersUrl),
    pageB.goto(membersUrl),
  ]);

  const convoUrl = 'https://dev.app.rukkor.com/space/2301/flow/9819/conversation';

  // Optional: Navigate to Members or Conversation pages
  
  await Promise.all([
    pageA.goto(convoUrl),
    pageB.goto(convoUrl),
  ]);

  // Close contexts
  
  await ctxA.close();
  await ctxB.close();
});

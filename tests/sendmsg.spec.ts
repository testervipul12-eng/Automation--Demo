import { test, expect } from '@playwright/test';

test('two users login with OTP and send/receive messages', async ({ browser }) => {
  // Create two independent contexts for two users
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

  // Navigate both users to login
  await Promise.all([
    pageA.goto('https://dev.app.rukkor.com/login'),
    pageB.goto('https://dev.app.rukkor.com/login'),
  ]);

  // Fill login form
  await pageA.fill('[data-cy="cy_email"]', userA.email);
  await pageA.fill('[data-cy="cy_password"]', userA.password);

  await pageB.fill('[data-cy="cy_email"]', userB.email);
  await pageB.fill('[data-cy="cy_password"]', userB.password);

  // Click Sign-in
  await Promise.all([
    pageA.click('[data-cy="cy_login"]'),
    pageB.click('[data-cy="cy_login"]'),
  ]);

  // Enter OTP
  const otp = "123456";
  for (let i = 0; i < otp.length; i++) {
    await pageA.fill(`//input[@aria-label="OTP Input ${i + 1}"]`, otp[i]);
    await pageB.fill(`//input[@aria-label="OTP Input ${i + 1}"]`, otp[i]);
  }

  // Verify login success
  await Promise.all([
    expect(pageA).toHaveURL(/contact\/my-contacts/, { timeout: 60000 }),
    expect(pageB).toHaveURL(/contact\/my-contacts/, { timeout: 60000 }),
  ]);

  console.log('✅ Both users logged in successfully');

  // Go to conversation page
  const convoUrl = 'https://dev.app.rukkor.com/space/2300/flow/9821/conversation';
  await Promise.all([
    pageA.goto(convoUrl),
    pageB.goto(convoUrl),
  ]);

  // -------------------------------
  // User A sends a message
  // -------------------------------
  const message = "Hello from User A 🚀";

  // Chat input wrapper (div contenteditable)
  const chatBoxA = pageA.locator("//div[@class='FlowMessageInputWrapper']//div[@contenteditable='true']");
  await chatBoxA.click();
  await chatBoxA.fill(message);

  // Click send button
  await pageA.click('button.sendMessageButton');

  // -------------------------------
  // User B validates the message
  // -------------------------------
  await expect(pageB.locator(`text=${message}`)).toBeVisible({ timeout: 10000 });
  console.log('✅ User B received the message from User A');

  // Cleanup
  await ctxA.close();
  await ctxB.close();
});

import { test, expect } from '@playwright/test';
import path from 'path';

test('Two users chat flow with message and file attachment', async ({ browser }) => {
  // -------------------------------
  // Context setup for 2 users
  // -------------------------------
  const ctxA = await browser.newContext();
  const ctxB = await browser.newContext();

  const pageA = await ctxA.newPage();
  const pageB = await ctxB.newPage();

  const userA = { email: 'vipul.qa1@gmail.com', password: 'Kmp@123456' };
  const userB = { email: 'vipul.stage@gmail.com', password: 'Kmp@123456' };
  const otp = '123456'; // fixed OTP for demo

  // -------------------------------
  // Step 1: Login both users
  // -------------------------------
  await Promise.all([pageA.goto('https://dev.app.rukkor.com/login'), pageB.goto('https://dev.app.rukkor.com/login')]);

  // Fill login form
  await pageA.fill('[data-cy="cy_email"]', userA.email);
  await pageA.fill('[data-cy="cy_password"]', userA.password);
  await pageB.fill('[data-cy="cy_email"]', userB.email);
  await pageB.fill('[data-cy="cy_password"]', userB.password);

  await Promise.all([pageA.click('[data-cy="cy_login"]'), pageB.click('[data-cy="cy_login"]')]);

  // Fill OTP
  for (let i = 0; i < otp.length; i++) {
    await pageA.fill(`//input[@aria-label="OTP Input ${i + 1}"]`, otp[i]);
    await pageB.fill(`//input[@aria-label="OTP Input ${i + 1}"]`, otp[i]);
  }

  // Wait for login redirect
  await Promise.all([
    expect(pageA).toHaveURL(/contact\/my-contacts/, { timeout: 60000 }),
    expect(pageB).toHaveURL(/contact\/my-contacts/, { timeout: 60000 }),
  ]);

  console.log('✅ Both users logged in successfully');

  // -------------------------------
  // Step 2: Navigate to conversation
  // -------------------------------
  const convoUrl = 'https://dev.app.rukkor.com/space/2452/flow/10341/conversation';
  await Promise.all([pageA.goto(convoUrl), pageB.goto(convoUrl)]);

  // -------------------------------
  // Helper functions
  // -------------------------------
  async function sendMessage(page, text: string) {
    const chatBox = page.locator("//div[contains(@class,'FlowMessageInputWrapper')]//div[@contenteditable='true']");
    await chatBox.click();
    await chatBox.fill(text);
    await page.click('button.sendMessageButton');
  }

  async function attachFile(page, fileName: string) {
    const fileInput = page.locator('input[type="file"]');
    const filePath = path.resolve(__dirname, fileName);
    await fileInput.setInputFiles(filePath);
    await page.click('button.sendMessageButton'); // Send after attachment
  }

  // -------------------------------
  // Step 3: User A sends a message → User B validates
  // -------------------------------
  const messageA = `Hello from Vipul QA 🚀 ${Date.now()}`;
  await sendMessage(pageA, messageA);
  await expect(pageB.getByText(messageA).last()).toBeVisible({ timeout: 30000 });
  console.log('✅ User B received the message from User A');

  // -------------------------------
  // Step 4: User B replies → User A validates
  // -------------------------------
  const messageB = `Hi Vipul 👋 reply at ${Date.now()}`;
  await sendMessage(pageB, messageB);
  await expect(pageA.getByText(messageB).last()).toBeVisible({ timeout: 30000 });
  console.log('✅ User A received the reply from User B');

  // -------------------------------
  // Step 5: User A sends a file → User B validates
  // -------------------------------
  const fileName = 'demo-file.pdf'; // make sure this file exists in your test folder
  await attachFile(pageA, fileName);
  await expect(pageB.getByText(fileName).last()).toBeVisible({ timeout: 30000 });
  console.log('✅ User B received the file from User A');

  // -------------------------------
  // Cleanup
  // -------------------------------
  await ctxA.close();
  await ctxB.close();
});


///Users/imac/Documents/Projects
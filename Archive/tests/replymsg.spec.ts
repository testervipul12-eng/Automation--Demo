import { test, expect } from '@playwright/test';

test('two users send and receive messages in common channel', async ({ browser }) => {
  // -------------------------------
  // Context setup for 2 users
  // -------------------------------
  const ctxA = await browser.newContext();
  const ctxB = await browser.newContext();

  const pageA = await ctxA.newPage();
  const pageB = await ctxB.newPage();

  const userA = { email: 'vipul.qa1@gmail.com', password: 'Kmp@123456' };
  const userB = { email: 'vipul.stage@gmail.com', password: 'Kmp@123456' };

  // -------------------------------
  // Step 1: Both users login
  // -------------------------------
  await Promise.all([
    pageA.goto('https://dev.app.rukkor.com/login'),
    pageB.goto('https://dev.app.rukkor.com/login'),
  ]);

  await pageA.fill('[data-cy="cy_email"]', userA.email);
  await pageA.fill('[data-cy="cy_password"]', userA.password);
  await pageB.fill('[data-cy="cy_email"]', userB.email);
  await pageB.fill('[data-cy="cy_password"]', userB.password);

  await Promise.all([
    pageA.click('[data-cy="cy_login"]'),
    pageB.click('[data-cy="cy_login"]'),
  ]);

  // OTP (fixed as 123456 for demo)
  const otp = "123456";
  for (let i = 0; i < otp.length; i++) {
    await pageA.fill(`//input[@aria-label="OTP Input ${i + 1}"]`, otp[i]);
    await pageB.fill(`//input[@aria-label="OTP Input ${i + 1}"]`, otp[i]);
  }

  // Verify login redirect
  await Promise.all([
    expect(pageA).toHaveURL(/contact\/my-contacts/, { timeout: 60000 }),
    expect(pageB).toHaveURL(/contact\/my-contacts/, { timeout: 60000 }),
  ]);

  console.log('✅ Both users logged in successfully');

  // -------------------------------
  // Step 2: Go to common conversation channel
  // -------------------------------
  const convoUrl = 'https://dev.app.rukkor.com/space/2452/flow/10341/conversation';
  await Promise.all([
    pageA.goto(convoUrl),
    pageB.goto(convoUrl),
  ]);

  // Helper function to send a message
  async function sendMessage(page, text: string) {
    const chatBox = page.locator("//div[@class='FlowMessageInputWrapper']//div[@contenteditable='true']");
    await chatBox.click();
    await chatBox.fill(text);
    await page.click('button.sendMessageButton');
  }

  // -------------------------------
  // Step 3: User A sends → User B validates
  // -------------------------------
  const messageA = `Hello from Vipul QA 🚀 ${Date.now()}`;
  await sendMessage(pageA, messageA);

  await expect(pageB.getByText(messageA).last()).toBeVisible({ timeout: 30000 });
  console.log('✅ vipul stage received the message from Vipul QA');

  // -------------------------------
  // Step 4: User B replies → User A validates

  // -------------------------------
  const messageB = `Hi Vipul 👋 reply at ${Date.now()}`;
  await sendMessage(pageB, messageB);

  await expect(pageA.getByText(messageB).last()).toBeVisible({ timeout: 30000 });
  console.log('✅ vipul received the reply from Vipul stage');

  // -------------------------------
  // Cleanup
  // -------------------------------
  await ctxA.close();
  await ctxB.close();
});

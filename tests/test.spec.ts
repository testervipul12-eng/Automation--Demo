import { test, expect, chromium } from '@playwright/test';

test('Rukkor - Create Space and Invite Another User (Two Browser Flow)', async () => {
  // --- Launch two browser contexts for two users ---
  const browser = await chromium.launch({ headless: false });
  const contextUserA = await browser.newContext();
  const contextUserB = await browser.newContext();
  const pageA = await contextUserA.newPage();
  const pageB = await contextUserB.newPage();

  // --- USER A LOGIN ---
  await pageA.goto('https://dev.app.rukkor.com/login');
  await pageA.fill('#loginForm_email', 'vipul.stage@gmail.com');
  await pageA.fill('[placeholder=" "]', 'Kmp@123456');
  await pageA.click('button:has-text("Sign in")');
  await expect(pageA.getByRole('heading', { name: 'Verify your account' })).toBeVisible();

  // Enter OTP (Static for now)
  const otp = ['1', '2', '3', '4', '5', '6'];
  for (let i = 0; i < otp.length; i++) {
    await pageA.getByRole('spinbutton', { name: `OTP Input ${i + 1}` }).fill(otp[i]);
  }

  // --- Go to Contacts -> Create Space ---
  await pageA.goto('https://dev.app.rukkor.com/contact/my-contacts');
  await pageA.getByRole('button', { name: 'Create space' }).click();
  await expect(pageA.getByRole('dialog', { name: 'Create a space' })).toBeVisible();

  // Fill Space details
  await pageA.fill('input[placeholder="Space name *"]', ' Test Space');
  await pageA.fill('textarea[placeholder="Add description"]', 'Automated test space by Playwright');
  await pageA.click('button:has-text("Create space")');
  await expect(pageA.getByText('More about space')).toBeVisible();
  await pageA.click('button:has-text("Skip for now")');

  // --- Invite another user ---
  await pageA.getByText('Manage users').click();
  await pageA.getByRole('heading', { name: 'Invite Users' }).click();
  await pageA.locator('input[placeholder="Enter email"]').fill('vik625@yopmail.com');
  await pageA.getByText('Select Role').click();
  await pageA.getByText('Member', { exact: true }).click();
  await pageA.getByRole('button', { name: 'Send Invitation' }).click();

  // Verify invitation appears in Pending list
  await pageA.getByRole('button', { name: 'Pending Invitations' }).click();
  await expect(pageA.getByText('vipul.stage@gmail.com')).toBeVisible();

  // --- USER B LOGIN (Separate browser context) ---
  await pageB.goto('https://dev.app.rukkor.com/login');
  await pageB.fill('#loginForm_email', 'vik625@yopmail.com');
  await pageB.fill('[placeholder=" "]', 'Kmp@123456');
  await pageB.click('button:has-text("Sign in")');
  await expect(pageB.getByRole('heading', { name: 'Verify your account' })).toBeVisible();

  // Enter same OTP
//   for (let i = 0; i < otp.length; i++) {
//     await pageB.getByRole('spinbutton', { name: `OTP Input ${i + 1}` }).fill(otp[i]);
//   }


// Enter OTP (Static for now)
const otp1 = ['1', '2', '3', '4', '5', '6'];
for (let i = 0; i < otp.length; i++) {
  await pageA.getByRole('spinbutton', { name: `OTP Input ${i + 1}` }).fill(otp1[i]);
}

  // --- Accept Invitation ---
  await pageB.goto('https://dev.app.rukkor.com/contact/my-contacts');
  await pageB.getByText('Invitation').click();
  await pageB.getByRole('button', { name: 'Accept' }).click();
  await expect(pageB.getByText('Vipul Auto Test Space')).toBeVisible();

  // --- Start Conversation ---
  await pageB.getByText('General').click();
  await pageB.locator('#tiptapcontent [role="textbox"]').fill('Hello Vipul! Invitation accepted 👋');
  await pageB.keyboard.press('Enter');

  // Verify message sent
  await expect(pageB.getByText('Hello Vipul! Invitation accepted 👋')).toBeVisible();

  // Close browsers
  await browser.close();
});

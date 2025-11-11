import { test, expect } from '@playwright/test';

test.describe('OTP Login Automation - Rukkor App', () => {
  const email = 'Vipul.qa1@gmail.com';
  const password = 'Kmp@123456';
  const otp = '123456'; // ✅ hardcoded OTP

  test('logs in, enters OTP, and creates a new space', async ({ page }) => {
    // 1. Visit Login Page
    await page.goto('https://dev.app.rukkor.com/login');

    // 2. Fill Login Form
    await page.fill('[data-cy="cy_email"]', email);
    await page.fill('[data-cy="cy_password"]', password);

    // Click login button
    const loginBtn = page.locator('[data-cy="cy_login"]');
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();

    // 3. Enter hardcoded OTP
    for (let i = 0; i < otp.length; i++) {
      await page.fill(`[aria-label="OTP Input ${i + 1}"]`, otp[i]);
    }

    // 4. Verify navigation after OTP
    await expect(page).toHaveURL('https://dev.app.rukkor.com/contact/my-contacts', {
      timeout: 20000,
    });

    // 5. Click on Create Space button
    const createSpaceBtn = page.locator('[data-cy="create-space-button"]');
    await expect(createSpaceBtn).toBeVisible();
    await createSpaceBtn.click();

    // 6. Click menu item
    const menuItem = page.locator('[data-cy="create-space-menu-item"]');
    await expect(menuItem).toBeVisible();
    await menuItem.click();

    // 7. Select "Community Space"
    const communityOption = page.locator('[data-cy="community-space-option"]');
    await expect(communityOption).toBeVisible();
    await communityOption.click();

    // 8. Select "Real ID"
    const realIdOption = page.locator('[data-cy="real-id-option"]');
    await expect(realIdOption).toBeVisible();
    await realIdOption.click();

    // 9. Enter space name
    await page.fill('[data-cy="space-name-input"]', 'Space01');

    // 10. Click Create Space
    const submitBtn = page.locator('[data-cy="create-space-submit-button"] > span');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // 11. Skip onboarding
   // const skipBtn = page.locator('[data-cy="skip-for-now-button"]').click();
    //await expect(skipBtn).toBeVisible();
    //await skipBtn.click();

    const skipBtn = page.locator("button[data-cy=\"skip-for-now-button\"]");
    //await expect(skipBtn).toBeVisible();
    await skipBtn.click();
  });
});

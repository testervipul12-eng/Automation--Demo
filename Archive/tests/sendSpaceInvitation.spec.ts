import { test, expect } from '@playwright/test';

test.describe('Rukkor App Automation - OTP Login, Create Space & Send Invitation', () => {
  const email = 'Vipul.qa1@gmail.com';
  const password = 'Kmp@123456';
  const otp = '123456'; // ✅ hardcoded OTP
  const inviteEmail = 'kantharia711999@gmail.com'; // ✅ email to invite

  test('logs in, enters OTP, creates space, and sends invitation', async ({ page }) => {
    // 1️⃣ Visit Login Page
    await page.goto('https://dev.app.rukkor.com/login');

    // 2️⃣ Fill Login Form
    await page.fill('[data-cy="cy_email"]', email);
    await page.fill('[data-cy="cy_password"]', password);
    const loginBtn = page.locator('[data-cy="cy_login"]');
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();

    // 3️⃣ Enter hardcoded OTP
    for (let i = 0; i < otp.length; i++) {
      await page.fill(`[aria-label="OTP Input ${i + 1}"]`, otp[i]);
    }

    // 4️⃣ Verify successful navigation after OTP
    await expect(page).toHaveURL(/contact\/my-contacts/, { timeout: 20000 });

    // 5️⃣ Click on Create Space button
    const createSpaceBtn = page.locator('[data-cy="create-space-button"]');
    await expect(createSpaceBtn).toBeVisible();
    await createSpaceBtn.click();

    // 6️⃣ Select menu item to create new space
    const menuItem = page.locator('[data-cy="create-space-menu-item"]');
    await expect(menuItem).toBeVisible();
    await menuItem.click();

    // 7️⃣ Select "Community Space"
    const communityOption = page.locator('[data-cy="community-space-option"]');
    await expect(communityOption).toBeVisible();
    await communityOption.click();

    // 8️⃣ Select "Real ID"
    const realIdOption = page.locator('[data-cy="real-id-option"]');
    await expect(realIdOption).toBeVisible();
    await realIdOption.click();

    // 9️⃣ Enter space name
    await page.fill('[data-cy="space-name-input"]', 'Space01');

    // 🔟 Click Create Space
    const submitBtn = page.locator('[data-cy="create-space-submit-button"] > span');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // 1️⃣1️⃣ Skip onboarding
    const skipBtn = page.locator('button[data-cy="skip-for-now-button"]');
    await skipBtn.click();

    // 1️⃣2️⃣ Wait for dashboard or space to load
    await page.waitForLoadState('networkidle');

    // 1️⃣3️⃣ Go to Members page
    await page.goto('https://dev.app.rukkor.com/space/2300/members');

    // 1️⃣4️⃣ Wait for Invite Users section
    await expect(page.locator('text=Invite Users')).toBeVisible();

    // 1️⃣5️⃣ Select Role as "Member" using XPath (AntD dropdown fix)
    const roleDropdown = page.locator("(//div[@class='ant-select-selector'])[1]");
    await roleDropdown.click();

    // Wait for dropdown options to appear
    const dropdown = page.locator('.ant-select-dropdown:visible');
    await expect(dropdown).toBeVisible();

    // Now select 'Member' from the visible dropdown
    await dropdown.locator("//div[contains(@class,'ant-select-item-option-content') and text()='Member']").click();


    // 1️⃣6️⃣ Enter Email ID using improved locator
    const emailInput = page.locator("//input[@name='userName' and @type='search']");
    await emailInput.click();
    await emailInput.fill(inviteEmail);

    // 1️⃣7️⃣ Click Invite Button
    const inviteButton = page.locator('button.invite-button');
    await inviteButton.click();

    // 1️⃣8️⃣ Verify Invitation Sent
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Pending Invitations')).toBeVisible();

    // ✅ Log result
    console.log(`✅ Invitation sent successfully to: ${inviteEmail}`);
  });
});

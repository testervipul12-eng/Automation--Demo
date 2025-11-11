
import { test, expect } from '@playwright/test';

test.describe('Rukkor App Automation - Two User Flow (Create Space & Accept Invitation)', () => {
  test.setTimeout(120000);
  const userA = {
    email: 'Vipul.qa1@gmail.com',
    password: 'Kmp@123456',
    otp: '123456',
  };

  const userB = {
    email: 'vipul.stage@gmail.com',
    password: 'Kmp@123456',
    otp: '123456',
  };

  const spaceName = 'Space-Auto-' + Date.now(); // unique space name

  test('User A creates space and invites User B, who accepts it', async ({ browser }) => {
    // ============================================
    // 1️⃣ CREATE CONTEXTS
    // ============================================
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();

    // ============================================
    // 2️⃣ LOGIN FUNCTION (Reusable)
    // ============================================
    async function loginUser(page, email, password, otp, label) {
      console.log(`🔹 Logging in as ${label} (${email})`);
      await page.goto('https://dev.app.rukkor.com/login');
      await page.fill('[data-cy="cy_email"]', email);
      await page.fill('[data-cy="cy_password"]', password);
      await page.click('[data-cy="cy_login"]');

      for (let i = 0; i < otp.length; i++) {
        await page.fill(`[aria-label="OTP Input ${i + 1}"]`, otp[i]);
      }

      await expect(page).toHaveURL(/contact\/my-contacts/, { timeout: 20000 });
      console.log(`✅ ${label} logged in successfully`);
    }

    // ============================================
    // 3️⃣ USER A LOGIN
    // ============================================
    await loginUser(pageA, userA.email, userA.password, userA.otp, 'User A');

    // ============================================
    // 4️⃣ USER B LOGIN
    // ============================================
    await loginUser(pageB, userB.email, userB.password, userB.otp, 'User B');

    // ============================================
    // 5️⃣ USER A CREATES SPACE
    // ============================================
    console.log('🏗️ User A creating new space...');
    const createSpaceBtn = pageA.locator('[data-cy="create-space-button"]');
    await expect(createSpaceBtn).toBeVisible();
    await createSpaceBtn.click();

    const menuItem = pageA.locator('[data-cy="create-space-menu-item"]');
    await menuItem.click();

    const communityOption = pageA.locator('[data-cy="community-space-option"]');
    await communityOption.click();

    const realIdOption = pageA.locator('[data-cy="real-id-option"]');
    await realIdOption.click();

    await pageA.fill('[data-cy="space-name-input"]', spaceName);

    const submitBtn = pageA.locator('[data-cy="create-space-submit-button"] > span');
    await submitBtn.click();

    // Skip onboarding
    const skipBtn = pageA.locator('button[data-cy="skip-for-now-button"]');
    await skipBtn.click();

    // Wait for redirect
    await pageA.waitForLoadState('networkidle');

    // ✅ Extract space ID dynamically from URL
    const currentUrl = pageA.url();
    const match = currentUrl.match(/space\/(\d+)/);
    const spaceId = match ? match[1] : null;

    expect(spaceId, 'Space ID should be present in the URL').not.toBeNull();
    console.log(`✅ Space "${spaceName}" created successfully with ID: ${spaceId}`);

    // ============================================
    // 6️⃣ USER A INVITES USER B TO SPACE
    // ============================================
    console.log(`📨 User A sending invitation to ${userB.email}...`);

    await pageA.goto(`https://dev.app.rukkor.com/space/${spaceId}/members`);
    await expect(pageA.locator('text=Invite Users')).toBeVisible();

    // Select Role as Member
    const roleDropdown = pageA.locator("(//div[@class='ant-select-selector'])[1]");
    await roleDropdown.click();

    const dropdown = pageA.locator('.ant-select-dropdown:visible');
    await dropdown
      .locator("//div[contains(@class,'ant-select-item-option-content') and text()='Member']")
      .click();

    // Enter Email ID
    const emailInput = pageA.locator("//input[@name='userName' and @type='search']");
    await emailInput.click();
    await emailInput.fill(userB.email);

    // Click Invite
    const inviteButton = pageA.locator('button.invite-button');
    await inviteButton.click();

    await pageA.waitForTimeout(2000);
    await expect(pageA.locator('text=Pending Invitations')).toBeVisible();
    console.log(`✅ Invitation sent to ${userB.email}`);

    // ============================================

      // ============================================

// 7️⃣ USER B ACCEPTS SPACE INVITATION
console.log('📬 User B checking and accepting invitation...');
await pageB.goto('https://dev.app.rukkor.com/space/invitations');

// Wait for the InviteSpaceLocate to be visible
  await pageB.waitForSelector('.invited-space-list .ant-tabs-tab-btn');
  // Locate all InviteSpaceLocate
  const InviteSpaceLocate = await pageB.$$('.invited-space-list .ant-tabs-tab-btn');
  if (InviteSpaceLocate.length > 0) {
    const InvitedSpace = InviteSpaceLocate[0];
    // Scroll into view and hover
    await InvitedSpace.scrollIntoViewIfNeeded();
    await InvitedSpace.hover();
    // Click the last avatar
    await InvitedSpace.click();
  } else {
    console.log('No InviteSpaceLocate found!');
  }


// // // Wait for invitation section
// // await expect(pageB.locator('.spaceInvitationHeader')).toBeVisible({ timeout: 20000 });

// // // Look for the correct invitation
 const invitationCard = pageB.locator(`.spaceInvitationHeader:has-text("${spaceName}")`);

// // await expect(invitationCard).toBeVisible({ timeout: 20000 });

// Click Accept
const acceptButton = invitationCard.locator('button:has-text("Accept")');
//await expect(acceptButton).toBeVisible();
//await acceptButton.click();
await pageB.getByRole('button', { name: 'Accept' }).click();


// Verify acceptance
// await expect(
//   pageB.locator('text=Joined').or(pageB.locator('text=Contact Added'))).toBeVisible({ timeout: 10000 });

// console.log(`✅ User B accepted the invitation for "${spaceName}"`);


    // ============================================
    // 8️⃣ VERIFY MEMBERSHIP
    // ============================================
    // console.log('🔍 Verifying that User B is now a member...');
    // await pageB.goto(`https://dev.app.rukkor.com/space/${spaceId}/members`);
    // await expect(pageB.locator(`text=${userB.email}`)).toBeVisible({ timeout: 10000 });
    // console.log(`🎉 Verification Success: ${userB.email} is now a member of "${spaceName}"`);

    // ============================================
    // 9️⃣ CLEANUP
    // ============================================
    await contextA.close();
    await contextB.close();
  });
});

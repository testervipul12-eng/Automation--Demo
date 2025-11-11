const { test, expect } = require('@playwright/test');

const registerUrl = 'https://dev.app.rukkor.com/register';

test.describe('Register Page UI and Functional Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(registerUrl);
  });

  // ---------- UI ELEMENT VERIFICATION ----------
  test('TC 001 : Verify page title is "Create account"', async ({ page }) => {
    await expect(page.locator('//h1[normalize-space()="Create account"]')).toBeVisible();
  });

  test('TC 002 : Verify page description is visible', async ({ page }) => {
    await expect(page.locator("//span[@class='AuthDescription']")).toBeVisible();
  });

  test('TC 003 : Verify First Name input field is visible', async ({ page }) => {
    await expect(page.locator('#signupForm_first_name')).toBeVisible();
  });

  test('TC 004 : Verify Last Name input field is visible', async ({ page }) => {
    await expect(page.locator('#signupForm_last_name')).toBeVisible();
  });

  test('TC 005 : Verify Username input field is visible', async ({ page }) => {
    await expect(page.locator('#signupForm_username')).toBeVisible();
  });

  test('TC 006 : Verify Email input field is visible', async ({ page }) => {
    await expect(page.locator('#signupForm_email')).toBeVisible();
  });

  test('TC 007 : Verify Password input field is visible', async ({ page }) => {
    await expect(page.locator('#signupForm_password')).toBeVisible();
  });

  test('TC 008 : Verify Confirm Password input field is visible', async ({ page }) => {
    await expect(page.locator('#signupForm_confirm_password')).toBeVisible();
  });

  test('TC 009 : Verify T&C checkbox is visible', async ({ page }) => {
    await expect(page.locator('#signupForm_tos_accept')).toBeVisible();
  });

  test('TC 010 : Verify Privacy Policy checkbox is visible', async ({ page }) => {
    await expect(page.locator('#signupForm_privacy_policy_accept')).toBeVisible();
  });

  test('TC 011 : Verify Sign Up button is visible', async ({ page }) => {
    await expect(page.locator('[data-cy="cy_next"]')).toBeVisible();
  });

  test('TC 012 : Verify "Sign in" link is visible', async ({ page }) => {
    await expect(page.locator('.signUp_button')).toBeVisible();
  });

  // ---------- FIELD VALIDATION TESTS ----------
  test('TC 013 : Verify error when First Name is empty', async ({ page }) => {
    await page.locator('[data-cy="cy_next"]').click();
    await expect(page.locator("//div[contains(text(),'ENTER_FIRST_NAME')]")).toBeVisible();
  });

  test('TC 014 : Verify error when Last Name is empty', async ({ page }) => {
    await page.locator('[data-cy="cy_next"]').click();
    await expect(page.locator("//div[contains(text(),'ENTER_LAST_NAME')]")).toBeVisible();
  });

  test('TC 015 : Verify minimum 2 characters validation for First Name', async ({ page }) => {
    await page.locator('#signupForm_first_name').fill('A');
    await page.locator('[data-cy="cy_next"]').click();
    await expect(page.locator("//div[contains(text(),'MINIMUM_2_CHARACTERS_REQUIRED')]")).toBeVisible();
  });

  test('TC 016 : Verify minimum 4 characters validation for Username', async ({ page }) => {
    await page.locator('#signupForm_username').fill('abc');
    await page.locator('[data-cy="cy_next"]').click();
    await expect(page.locator("//div[contains(text(),'MINIMUM_4_CHARACTERS_REQUIRED')]")).toBeVisible();
  });

  test('TC 017 : Verify Sign Up button is disabled until all mandatory fields are filled', async ({ page }) => {
    const button = page.locator('[data-cy="cy_next"]');
    await expect(button).toBeDisabled();
  });

  test('TC 018 : Verify user can check Terms & Conditions checkbox', async ({ page }) => {
    const checkbox = page.locator('#signupForm_tos_accept');
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  test('TC 019 : Verify user can check Privacy Policy checkbox', async ({ page }) => {
    const checkbox = page.locator('#signupForm_privacy_policy_accept');
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  // ---------- FUNCTIONAL TESTS ----------
  test('TC 020 : Verify user can fill all fields and submit registration form', async ({ page }) => {
    const randomNum = Math.floor(Math.random() * 10000);
    await page.locator('#signupForm_first_name').fill('Vipul');
    await page.locator('#signupForm_last_name').fill('K');
    await page.locator('#signupForm_username').fill(`vipul${randomNum}`);
    await page.locator('#signupForm_email').fill(`vipul${randomNum}@yopmail.com`);
    await page.locator('#signupForm_password').fill('Rukkor@098');
    await page.locator('#signupForm_confirm_password').fill('Rukkor@098');
    await page.locator('#signupForm_tos_accept').check();
    await page.locator('#signupForm_privacy_policy_accept').check();
    await page.locator('[data-cy="cy_next"]').click();
    await expect(page.locator('text=OTP')).toBeVisible({ timeout: 10000 });
  });

  test('TC 021 : Verify OTP input boxes are visible', async ({ page }) => {
    await page.goto('https://dev.app.rukkor.com/otp');
    for (let i = 1; i <= 6; i++) {
      await expect(page.locator(`(//input[@type='number'])[${i}]`)).toBeVisible();
    }
  });

  test('TC 022 : Verify Sign in link navigates to login page', async ({ page }) => {
    await page.locator('.signUp_button').click();
    await expect(page).toHaveURL(/login/);
  });
});

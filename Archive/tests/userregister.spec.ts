import { test, expect } from '@playwright/test';

// URL of the registration page
const registrationUrl = 'https://dev.app.rukkor.com/signup';

test.describe('Registration Form Validation Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(registrationUrl);
  });

  test('TC001 - Blank Required Fields Validation and Sign Up Button Disabled', async ({ page }) => {
    // Leave all fields blank; check Sign Up button disabled
    const signUpBtn = page.locator('[data-cy=cy_next]');
    await expect(signUpBtn).toBeDisabled();

    // Check each field validation message by focusing and blurring without input
    const fields = ['cy_first_name', 'cy_last_name', 'cy_username', 'cy_email', 'cy_password', 'cy_confirm_password'];
    for (const field of fields) {
      const input = page.locator(`[data-cy=${field}]`);
      await input.focus();
      await input.blur();
      await expect(page.locator(`text=Please enter`)).toBeVisible();
    }
  });

  test('TC002 - Password Length and Match Validation', async ({ page }) => {
    await page.fill('[data-cy=cy_password]', 'short');
    await page.fill('[data-cy=cy_confirm_password]', 'shorter');
    await expect(page.locator('text=Password must be at least 10 characters long.')).toBeVisible();
    await expect(page.locator('text=Oops! The passwords you entered don’t match.')).toBeVisible();

    // Fix passwords
    await page.fill('[data-cy=cy_password]', 'longenoughpassword');
    await page.fill('[data-cy=cy_confirm_password]', 'longenoughpassword');
    await expect(page.locator('text=Password must be at least 10 characters long.')).toHaveCount(0);
    await expect(page.locator('text=Oops! The passwords you entered don’t match.')).toHaveCount(0);
  });

  test('TC003 - Email Format Validation', async ({ page }) => {
    await page.fill('[data-cy=cy_email]', 'invalidemail');
    await page.locator('[data-cy=cy_email]').blur();
    await expect(page.locator('text=Enter Valid Email')).toBeVisible();

    // Fix email
    await page.fill('[data-cy=cy_email]', 'valid@example.com');
    await expect(page.locator('text=Enter Valid Email')).toHaveCount(0);
  });

  test('TC004 - Terms & Privacy Checkbox Behavior and Sign Up Button Enable/Disable', async ({ page }) => {
    // Fill valid data in all fields except checkboxes
    await page.fill('[data-cy=cy_first_name]', 'John');
    await page.fill('[data-cy=cy_last_name]', 'Doe');
    await page.fill('[data-cy=cy_username]', 'john.doe12');
    await page.fill('[data-cy=cy_email]', 'john.doe@example.com');
    await page.fill('[data-cy=cy_password]', 'strongpassword');
    await page.fill('[data-cy=cy_confirm_password]', 'strongpassword');

    const signUpBtn = page.locator('[data-cy=cy_next]');
    const tosCheckbox = page.locator('#signupForm_tos_accept');
    const privacyCheckbox = page.locator('#signupForm_privacy_policy_accept');

    // Both unchecked => Sign Up disabled
    await tosCheckbox.uncheck();
    await privacyCheckbox.uncheck();
    await expect(signUpBtn).toBeDisabled();

    // Only T&C checked => Sign Up disabled
    await tosCheckbox.check();
    await privacyCheckbox.uncheck();
    await expect(signUpBtn).toBeDisabled();

    // Only Privacy checked => Sign Up disabled
    await tosCheckbox.uncheck();
    await privacyCheckbox.check();
    await expect(signUpBtn).toBeDisabled();

    // Both checked => Sign Up enabled
    await tosCheckbox.check();
    await privacyCheckbox.check();
    await expect(signUpBtn).toBeEnabled();
  });

  test('TC005 - Username Minimum Length Validation', async ({ page }) => {
    await page.fill('[data-cy=cy_username]', 'abc');
    await page.locator('[data-cy=cy_username]').blur();
    await expect(page.locator('text=Please enter at least 4 characters.')).toBeVisible();

    await page.fill('[data-cy=cy_username]', 'abcd');
    await expect(page.locator('text=Please enter at least 4 characters.')).toHaveCount(0);
  });

  test('TC006 - Successful Registration', async ({ page }) => {
    await page.fill('[data-cy=cy_first_name]', 'John');
    await page.fill('[data-cy=cy_last_name]', 'Doe');
    await page.fill('[data-cy=cy_username]', 'john.doe');
    await page.fill('[data-cy=cy_email]', 'john.doe@example.com');
    await page.fill('[data-cy=cy_password]', 'strongpassword');
    await page.fill('[data-cy=cy_confirm_password]', 'strongpassword');

    await page.check('#signupForm_tos_accept');
    await page.check('#signupForm_privacy_policy_accept');

    await page.click('[data-cy=cy_next]');

    // Expect navigation or confirmation message visible after registration
    await expect(page).toHaveURL('https://dev.app.rukkor.com/contact/my-contacts');
   // await expect(page.locator('text=Thank you for registering')).toBeVisible();
  });

});

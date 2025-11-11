import { test, expect } from '@playwright/test';
import { only } from 'node:test';

const loginUrl = 'https://dev.app.rukkor.com/login';

test.describe('Login Page UI and Functional Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(loginUrl);
  });

  test( 'TC 001 : Verify Rukkor logo is visible', async ({ page }) => {
    await expect(page.locator('img[alt="Logo"]').first()).toBeVisible();
  });

test(' TC 002 : Verify page title contains "Welcome back"', async ({ page }) => {
        await expect(page.locator('h1.AuthHeader')).toHaveText('Welcome back');
  });



test(' TC 003 : Verify all key UI elements are visible', async ({ page }) => {
  test.setTimeout(30000); // set 30 seconds timeout for this test

  // Email field
  await expect(page.locator('[data-cy="cy_email"]')).toBeVisible();

  // Password field
  await expect(page.locator('[data-cy="cy_password"]')).toBeVisible();

  // To Do : Need to Re-test after fixed
  // Language dropdown (default should be English)
//   const languageDropdown = page.locator('[data-cy="cy_language"]');
//   await expect(languageDropdown).toBeVisible();  
//   await expect(languageDropdown.locator('option[selected]')).toHaveText('English');

  // Sign in button
  await expect(page.locator('[data-cy="cy_login"]')).toBeVisible();

  // Reset password link
  await expect(page.locator('[data-cy="cy_forgotPassword"]')).toBeVisible();

  // Sign up button/link
  await expect(page.locator('[data-cy="cy_new_user_signUp"]')).toBeVisible();
});



  test(' TC 004 : Verify asterisk marks for required Email and Password', async ({ page }) => {
    await expect(page.locator('label:has-text("Email") >> span')).toHaveText('*');
    await expect(page.locator('label:has-text("Password") >> span')).toHaveText('*');
  });

  // TODO: Fix the test
//   test('Sign in button is disabled by default', async ({ page }) => {
//     await expect(page.locator('button:has-text("Sign in")')).toBeDisabled();
//   });

//ToDo :remove after fixed
  test('TC 005 : Sign in button is disabled when Email and Password are empty', async ({ page }) => {
    await expect(page.locator('button:has-text("Sign in")')).toBeDisabled();
  });

//ToDo :Review After Fixed
  //   test('TC 006 : Click on sign in button gives error when email and password are empty', async ({ page }) => {
  //   //await page.click('button:has-text("Sign in")');

  //   await expect(page.locator('text=Enter Email')).toBeVisible();
  //   await expect(page.locator('text= Please enter password')).toBeVisible();
  // });


  // // test('TC 006 : Click on sign in button gives error when email and password are empty', async ({ page }) => {
  // //   // Navigate to the login page if not already handled
  // //   // await page.goto('your-login-page-url');
  
  //   // Wait for the Sign In button to be enabled (if it's dynamically enabled)
  //   await page.waitForSelector('[data-cy="cy_login"]:not([enabled])');
  
  //   // Click the Sign In button
  //   await page.click('[data-cy="cy_login"]');
  
  //   // Assert error messages are visible
  //   await expect(page.locator('text=Enter Email')).toBeVisible();
  //   await expect(page.locator('text=Please enter password')).toBeVisible();
  // });  

  test('TC 006 : check that signup button is disable by default', async ({ page }) => {
    await expect(page.locator('[data-cy="cy_login"]')).toBeDisabled();
  });

  test('TC 007 : Email input accepts text', async ({ page }) => {
    test.setTimeout(30000); // set 60 seconds timeout for this test
    const emailInput = page.locator('[data-cy="cy_email"]');
    await emailInput.fill('test@example.com');
    expect(await emailInput.inputValue()).toBe('test@example.com');
  });

  test('TC 008 : Password input accepts text and is masked', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('mypassword');
    expect(await passwordInput.inputValue()).toBe('mypassword');
    expect(await passwordInput.getAttribute('type')).toBe('password');
  });


  test('TC 009 : Show validation when email typed and removed', async ({ page }) => {
    const emailInput = page.locator('[data-cy="cy_email"]');      
    await emailInput.fill('a@b.com');    
    await emailInput.clear();
   await expect(page.locator('text=Enter Email')).toBeVisible();
  });

  test('TC 010 :Form validation for empty Password field', async ({ page }) => {
    const passwordInput = page.locator('[data-cy="cy_password"]');
    await passwordInput.fill('Test@123456');
    await passwordInput.clear();
    await expect(page.locator('text=Please enter password')).toBeVisible();
  });

  // test.only('TC 011 :Email field placeholder text check', async ({ page }) => {
  //   const emailInput = page.locator('[data-cy="cy_email"]');
  //   expect(await emailInput.getAttribute('placeholder')).toBe('Email'); // adjust placeholder if needed
  // });


  // test.only('TC 011: Email field label text check', async ({ page }) => {
  //   await page.waitForSelector('[data-cy="cy_email"]');
  //   const label = page.locator('[data-cy="cy_email"]');
  //  // await expect(label).toHaveText(/Email/i);
  // });

  test('TC 012 :Password field placeholder text check', async ({ page }) => {
    test.skip();
    const passwordInput = page.locator('input[type="password"]');
    expect(await passwordInput.getAttribute('placeholder')).toBe('Password'); // adjust placeholder if needed
  });

  test('TC 013 :Page responsiveness on different viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 1280, height: 720 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];
    for(const vp of viewports) {
      await page.setViewportSize(vp);
      await expect(page.locator('form')).toBeVisible();
    }
  });

  test.only('TC 014 :Error handling with invalid email format', async ({ page }) => {
    await page.fill('input[type="email"]', 'Enter Valid Email');
    //await page.fill('input[type="password"]', 'validpassword');
    await page.click('button:has-text("Sign in")'); 
    await expect(page.locator('text=Enter Valid Email')).toBeVisible();
  });

  test('TC 015 : Page load within acceptable time', async ({ page }) => {
    const response = await page.goto(loginUrl);
    expect(response?.ok()).toBeTruthy();
  });


  // TODO: Fix the test
//   test('All interactive elements are keyboard accessible', async ({ page }) => {
//     await page.keyboard.press('Tab');
//     const activeElement = await page.evaluate(() => document.activeElement.tagName);
//     expect(['INPUT', 'BUTTON', 'SELECT', 'A']).toContain(activeElement);
//   });



  test('TC 016 : Valid email format accepted without validation error', async ({ page }) => {
    test.skip();
    await page.fill('input[type="email"]', 'valid@example.com');
    await page.locator('input[type="email"]').blur();
    await expect(page.locator('text=Enter Valid Email')).toHaveCount(0);
  });

  // test('TC 017 : Invalid email formats show validation error', async ({ page }) => {
  //   const invalidEmails = ['abc', 'abc@', 'abc@xyz', 'abc@.com'];
  //   for (const email of invalidEmails) {
  //     await page.fill('input[type="email"]', email);
  //     await page.locator('input[type="email"]').blur();
  //     await expect(page.locator('text=Enter Valid Email')).toBeVisible();
  //   }
  // });

  

  test('TC 017 : Invalid email formats show validation error', async ({ page }) => {
    const cy_email = page.locator('[data-cy="cy_email"]');
    //const emailInput = page.locator('[data-cy="cy_email"]'); 
    const cy_error = page.locator('text=Enter Valid Email');
    const invalidEmails = ['abc', 'abc@', 'abc@xyz', 'abc@.com'];
  
    // Ensure email field is ready before loop starts
    await cy_email.waitFor({ state: 'visible', timeout: 10000 });
  
    for (const email of invalidEmails) {
      // Clear field safely
      await cy_email.click({ timeout: 5000 });
      await cy_email.press('Meta+A');
      await cy_email.press('Backspace');
  
      // Fill and blur
      await cy_email.fill(email);
      await cy_email.blur();
  
      // Wait for and check validation message
      await expect(cy_error).toBeVisible({ timeout: 5000 });
    }
  });
  

test('TC 018 : Email field copy-paste functionality', async ({ page }) => { 
  await page.goto(loginUrl);
  // Use the test ID selector
  const emailInput = page.locator('[data-cy="cy_email"]');
  // Wait for the input to be visible
  await emailInput.waitFor({ state: 'visible', timeout: 5000 });
  // Type email, copy it, clear the input, and paste it back
  await emailInput.fill('');
  await emailInput.type('copy@example.com');
  await emailInput.selectText();
  await page.keyboard.press('Meta+c'); // Cmd+C for Mac
  await emailInput.fill('');
  await emailInput.click();
  await page.keyboard.press('Meta+v'); // Cmd+V for Mac

  // Assert the value is correctly pasted
  await expect(emailInput).toHaveValue('copy@example.com');
});

test('TC 019 : Email field accepts spaces before and after input', async ({ page }) => {
    await page.goto(loginUrl);  
    const emailInput = page.locator('[data-cy="cy_email"]');
    await emailInput.waitFor({ state: 'visible' });  
    const testValue = '    test@example.com  ';
    await emailInput.fill(testValue);  
    await expect(emailInput).toHaveValue(testValue); // Match actual behavior
  }); 

  test.only('TC 020 : Eye icon toggles password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('mypassword');
    const eyeIcon = page.locator('button[aria-label="Toggle password visibility"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await eyeIcon.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await eyeIcon.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC 021 : Login successfully with OTP and create space - Placeholder (requires custom implementation)', async ({ page }) => {
    test.skip();
  });

});

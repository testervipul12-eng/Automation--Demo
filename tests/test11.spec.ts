import { test, expect } from '@playwright/test';

test.describe('Message Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to General channel
    await page.goto('https://dev.app.rukkor.com/login');
    
    // Login steps
    await page.locator('#loginForm_email').fill('vipul.qa1@gmail.com');
    await page.getByPlaceholder(' ').fill('Kmp@123456');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // OTP verification
    await expect(page.getByRole('heading', { name: 'Verify your account' })).toBeVisible();
    const otpInputs = await page.getByRole('spinbutton').all();
    for (let i = 0; i < 6; i++) {
      await otpInputs[i].fill((i + 1).toString());
    }
    
    // Navigate to spaces and select General channel
    await page.getByRole('button', { name: 'SPACES' }).click();
    await page.getByText('2 Members').first().click();
    await page.getByRole('treeitem', { name: 'General' }).locator('div').first().click();
  });

  test('should send a new message', async ({ page }) => {
    const testMessage = 'Hello, this is a test message!';
    
    // Send message
    await page.locator('#tiptapcontent').getByRole('textbox').fill(testMessage);
    await page.locator('.sendMessageButton').click();
    
    // Verify message was sent
    await expect(page.getByText(testMessage).first()).toBeVisible();
  });

  test('should edit an existing message', async ({ page }) => {
    const originalMessage = 'Original test message';
    const editedMessage = 'Edited test message';
    
    // Send original message
    await page.locator('#tiptapcontent').getByRole('textbox').fill(originalMessage);
    await page.locator('.sendMessageButton').click();
    
    // Edit the message
    await page.getByText(originalMessage).first().hover();
    await page.getByRole('tooltip', { name: '👍 ❤️ 😀 😎 👎' }).locator('svg').nth(2).click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    
    // Update message text
    await page.getByRole('textbox').filter({ hasText: originalMessage }).fill(editedMessage);
    await page.locator('.sendMessageButton').click();
    
    // Verify message was edited
    await expect(page.getByText(editedMessage).first()).toBeVisible();
     await expect(page.getByText('Edited')).toBeVisible();
  });

  test('should delete a message', async ({ page }) => {
    const messageToDelete = 'Message to be deleted';
    
    // Send message
    await page.locator('#tiptapcontent').getByRole('textbox').fill(messageToDelete);
    await page.locator('.sendMessageButton').click();
    
    // Delete the message
    await page.getByText(messageToDelete).first().hover();
    await page.getByRole('tooltip', { name: '👍 ❤️ 😀 😎 👎' }).locator('svg').nth(2).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    
    // Confirm deletion
    await page.getByRole('button', { name: 'Yes' }).click();
    
    // Verify message was deleted
    await expect(page.getByText(messageToDelete)).not.toBeVisible();
    await expect(page.getByText('Message deleted')).toBeVisible();
  });

  test('should send message with emoji', async ({ page }) => {
    const messageWithEmoji = 'Message with emoji ';
    
    // Send message
    await page.locator('#tiptapcontent').getByRole('textbox').fill(messageWithEmoji);
    
    // Add emoji
    await page.locator('.emoji-gif-trigger').click();
    await page.getByRole('button', { name: 'grinning' }).click();
    await page.locator('.sendMessageButton').click();
    
    // Verify message with emoji was sent
    await expect(page.getByText(messageWithEmoji)).toBeVisible();
    await expect(page.getByRole('img', { name: '😀' })).toBeVisible();
  });

  test('should handle multiple message operations in sequence', async ({ page }) => {
    const messages = {
      original: 'First message',
      edited: 'Edited first message',
      new: 'Second message'
    };
    
    // Send first message
    await page.locator('#tiptapcontent').getByRole('textbox').fill(messages.original);
    await page.locator('.sendMessageButton').click();
    
    // Edit first message
    await page.getByText(messages.original).first().hover();
    await page.getByRole('tooltip', { name: '👍 ❤️ 😀 😎 👎' }).locator('svg').nth(2).click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await page.getByRole('textbox').filter({ hasText: messages.original }).fill(messages.edited);
    await page.locator('.sendMessageButton').click();
    
    // Send second message
    await page.locator('#tiptapcontent').getByRole('textbox').fill(messages.new);
    await page.locator('.sendMessageButton').click();
    
    // Delete second message
    await page.getByText(messages.new).first().hover();
    await page.getByRole('tooltip', { name: '👍 ❤️ 😀 😎 👎' }).locator('svg').nth(2).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    
    // Verify final state
    await expect(page.getByText(messages.edited)).toBeVisible();
    await expect(page.getByText(messages.new)).not.toBeVisible();
    await expect(page.getByText('Edited')).toBeVisible();
  });
});
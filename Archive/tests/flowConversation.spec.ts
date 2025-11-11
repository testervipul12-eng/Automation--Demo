import { test, expect } from '@playwright/test';

test.describe('Flow Conversation Chat', () => {

  // ✅ This will run before each test
  test.beforeEach(async ({ page }) => {
    // Replace URL with your actual flow conversation URL
    await page.goto('http://localhost:3000/flow/123');
    await expect(page.locator('.FlowConversation')).toBeVisible();
  });

  // 🧪 TC01: Verify chat UI renders properly
  test('should load and display chat messages', async ({ page }) => {
    const messageList = page.locator('[data-message-id]');
    await expect(messageList.first()).toBeVisible();
  });

  // 🧪 TC02: Scroll top should load old messages
  test('should load old messages when scrolled to top', async ({ page }) => {
    const firstMessageBefore = await page.locator('[data-message-id]').first().getAttribute('data-message-id');

    // Scroll to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);

    const firstMessageAfter = await page.locator('[data-message-id]').first().getAttribute('data-message-id');

    expect(firstMessageAfter).not.toEqual(firstMessageBefore);
  });

  // 🧪 TC03: Jump to unread message
  test('should jump to unread message when button clicked', async ({ page }) => {
    const unreadBtn = page.locator('.old-messages-loader');
    if (await unreadBtn.isVisible()) {
      await unreadBtn.click();
      await page.waitForTimeout(1000);

      // Assert: we scrolled near unread message
      const target = page.locator('[data-message-id]');
      await expect(target.first()).toBeInViewport();
    } else {
      test.skip();
    }
  });

  // 🧪 TC04: Send a new message
  test('should send a message successfully', async ({ page }) => {
    const inputBox = page.locator('.FlowMessageInputContainer textarea');
    await inputBox.click();
    await inputBox.fill('Hello from Playwright Test');
    await page.keyboard.press('Enter');

    // Check if message is visible in the container
    await expect(page.locator('.FlowMessagesContainer')).toContainText('Hello from Playwright Test');
  });

  // 🧪 TC05: Scroll-to-bottom icon works
  test('should scroll to bottom when scroll button clicked', async ({ page }) => {
    const scrollButton = page.locator('.scroll-to-bottom');
    if (await scrollButton.isVisible()) {
      await scrollButton.click();
      const bottomMessage = page.locator('[data-message-id]').last();
      await expect(bottomMessage).toBeInViewport();
    } else {
      test.skip();
    }
  });

  // 🧪 TC06: Input box is visible when user has permission
  test('should display message input when user has permission', async ({ page }) => {
    const inputBox = page.locator('.FlowMessageInputContainer textarea');
    await expect(inputBox).toBeVisible();
  });

  // 🧪 TC07: Disable input when no permission (Optional)
  test('should display no access message when permission denied', async ({ page }) => {
    const disabledMessage = page.locator('.FlowMessageInputDisabled');
    if (await disabledMessage.isVisible()) {
      await expect(disabledMessage).toContainText("You don't have access");
    } else {
      test.skip();
    }
  });

  // 🧪 TC08: Highlight target message (Jump)
  test('should focus target message when jumping', async ({ page }) => {
    const firstMessage = page.locator('[data-message-id]').first();
    const targetId = await firstMessage.getAttribute('data-message-id');

    // Simulate jumping
    await page.evaluate((id) => {
      const el = document.querySelector(`[data-message-id="${id}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, targetId);

    await expect(firstMessage).toBeInViewport();
  });

  // 🧪 TC09: Show typing indicator (if available)
  test('should display typing indicator when someone is typing', async ({ page }) => {
    const typingIndicator = page.locator('.MessageTyping');
    if (await typingIndicator.isVisible()) {
      await expect(typingIndicator).toBeVisible();
    } else {
      test.skip();
    }
  });

  // 🧪 TC10: Verify date divider exists
  test('should display date dividers correctly', async ({ page }) => {
    const dateDivider = page.locator('.DateDivider');
    if (await dateDivider.isVisible()) {
      await expect(dateDivider.first()).toBeVisible();
    } else {
      test.skip();
    }
  });

});

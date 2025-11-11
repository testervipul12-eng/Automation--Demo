import { test, expect } from '@playwright/test';

test.describe('Message Reactions Component', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000'); // adjust your local dev URL
  });

  test('should display all emoji reactions', async ({ page }) => {
    const wrapper = page.locator('.FlowMessageContent_ReactionWrapper');
    await expect(wrapper).toBeVisible();

    const reactions = wrapper.locator('.FlowMessageContent_ReactionItem');
    await expect(reactions).toHaveCount(3); // adjust expected count
  });

  test('should show tooltip with user names on hover', async ({ page }) => {
    const reaction = page.locator('.FlowMessageContent_ReactionItem').first();
    await reaction.hover();

    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('YOU'); // or other usernames
  });

  test('should toggle reaction on click', async ({ page }) => {
    const myReaction = page.locator('.FlowMessageContent_ReactionItem').first();
    await myReaction.click();
    await expect(myReaction).toHaveClass(/myReaction/); // toggled on

    // click again to remove reaction
    await myReaction.click();
    await expect(myReaction).not.toHaveClass(/myReaction/);
  });

});

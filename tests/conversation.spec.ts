import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://dev.app.rukkor.com/login');
  await expect(page.getByRole('img', { name: 'Logo' }).first()).toBeVisible();

  await page.locator('#loginForm_email').click();
  await page.locator('#loginForm_email').fill('vipul.stage@gmail.com');
  await page.locator('#loginForm_email').press('Tab');
  await page.getByPlaceholder(' ').fill('Kmp@123456');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('spinbutton', { name: 'OTP Input 1' }).fill('1');
  await page.getByRole('spinbutton', { name: 'OTP Input 2' }).fill('2');
  await page.getByRole('spinbutton', { name: 'OTP Input 3' }).fill('3');
  await page.getByRole('spinbutton', { name: 'OTP Input 4' }).fill('4');
  await page.getByRole('spinbutton', { name: 'OTP Input 5' }).fill('5');
  await page.getByRole('spinbutton', { name: 'OTP Input 6' }).fill('6');
  await expect(page.getByRole('button', { name: 'VS Vipul Stage' })).toBeVisible();

  await page.getByRole('button', { name: 'SPACES' }).click();
  await expect(page.getByRole('menuitem', { name: 'Hide muted flows' })).toBeVisible();

  await page.getByRole('button', { name: 'Create space' }).click();
  await expect(page.getByRole('dialog', { name: 'Create a space' })).toBeVisible();

  await page.locator('.space-option').first().click();
  await expect(page.getByRole('dialog', { name: 'Profile type' })).toBeVisible();

  await page.getByRole('heading', { name: 'Real Id' }).click();
  await expect(page.getByRole('dialog', { name: 'Your private space' })).toBeVisible();

  await page.locator('div').filter({ hasText: /^Upload Logo$/ }).nth(2).click();
  await page.locator('div').filter({ hasText: 'Your private spaceLorem ipsum' }).nth(4).setInputFiles('84d3b738-1642-4a1f-8602-c6f6022782a5.jpeg');
  await expect(page.getByRole('dialog', { name: 'Edit image' })).toBeVisible();

  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('link', { name: 'default' })).toBeVisible();

  await page.locator('.anticon.anticon-plus > svg').click();
  await page.locator('div').filter({ hasText: 'Your private spaceLorem ipsum' }).nth(4).setInputFiles('313daf3d-c4fd-4a48-8277-68f306b359c3.jpeg');
  await expect(page.getByRole('dialog', { name: 'Edit image' })).toBeVisible();

  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.locator('section').filter({ hasText: '↺↻' }).getByRole('slider').click();
  await page.getByText('Edit image－＋↺↻↕↔ResetCancelOK').click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.locator('.anticon.anticon-plus > svg').click();
  await page.locator('div').filter({ hasText: 'Your private spaceLorem ipsum' }).nth(4).setInputFiles('313daf3d-c4fd-4a48-8277-68f306b359c3.jpeg');
  await expect(page.getByRole('dialog', { name: 'Edit image' })).toBeVisible();

  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.getByTestId('cropper').click();
  await page.locator('.img-crop-control.img-crop-control-aspect > .ant-slider').click();
  await page.locator('section').filter({ hasText: '↕↔' }).getByRole('slider').click();
  await page.locator('section').filter({ hasText: '↕↔' }).getByRole('slider').click();
  await expect(page.getByRole('tooltip', { name: '1.26' })).toBeVisible();

  await page.getByRole('button', { name: '↔' }).dblclick();
  await page.locator('section').filter({ hasText: '↕↔' }).getByRole('slider').click();
  await page.getByRole('button', { name: '↔' }).dblclick();
  await page.getByRole('button', { name: '↔' }).dblclick();
  await page.locator('section').filter({ hasText: '↕↔' }).getByRole('slider').click();
  await page.locator('.img-crop-control.img-crop-control-aspect > .ant-slider > .ant-slider-rail').click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('textbox', { name: 'Space name *' }).click();
  await page.getByRole('textbox', { name: 'Space name *' }).fill('Test Space');
  await page.getByRole('textbox', { name: 'Space name *' }).press('Tab');
  await page.getByRole('textbox', { name: 'Add description' }).fill('Test ');
  await page.getByRole('button', { name: 'loading Create space' }).click();
  await expect(page.getByRole('dialog', { name: 'More about space' })).toBeVisible();

  await page.getByText('More about spaceGreat! Your').click();
  await page.getByRole('button', { name: 'Skip for now' }).click();
  await expect(page.getByRole('button', { name: 'Test Space' })).toBeVisible();

  await page.locator('.ant-drawer-mask').click();
  await page.locator('#rc_select_6').click();
  await page.getByText('Member', { exact: true }).nth(1).click();
  await page.locator('#rc_select_7').click();
  await page.locator('#rc_select_7').fill('vipul.qa1@gmail.com');
  await page.locator('form').getByRole('button').filter({ hasText: /^$/ }).click();
  await page.locator('div').filter({ hasText: /^SS$/ }).nth(2).click();
  await page.getByRole('treeitem', { name: 'General' }).click();
  await expect(page.getByRole('button', { name: 'ellipsis' })).toBeVisible();

  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('#tiptapcontent').getByRole('textbox').fill('Hello Test msg');
  await page.locator('button[name="attachment"]').click();
  await page.locator('#tiptapcontent').getByRole('textbox').setInputFiles('84d3b738-1642-4a1f-8602-c6f6022782a5.jpeg');
  await expect(page.getByRole('img', { name: 'thumbnail' })).toBeVisible();

  await page.locator('.ant-btn.css-n1j8ju.ant-btn-text.ant-btn-color-default.ant-btn-variant-text.ant-btn-icon-only.sendMessageButton').click();
  await page.locator('button[name="attachment"]').click();
  await page.locator('#tiptapcontent').getByRole('textbox').setInputFiles('UX Rules.pdf');
  await expect(page.getByRole('heading', { name: 'UX Rules.pdf' })).toBeVisible();

  await page.locator('button[name="attachment"]').click();
  await page.locator('#tiptapcontent').getByRole('textbox').setInputFiles('iago-fan-casting-poster-264685-larg1111e.jpg');
  await page.locator('button[name="attachment"]').click();
  await page.locator('#tiptapcontent').getByRole('textbox').setInputFiles('Paper_art_Rocket.mov');
  await page.locator('.text-editor-attachment-image > .closeBtn > .svg-inline--fa > path').click();
  await page.locator('.ant-btn.css-n1j8ju.ant-btn-text.ant-btn-color-default.ant-btn-variant-text.ant-btn-icon-only.sendMessageButton').click();
  await expect(page.getByRole('tooltip', { name: '👍 ❤️ 😀 😎 👎' })).toBeVisible();

  await page.getByText('❤️').click();
  await expect(page.getByRole('img', { name: '❤️' })).toBeVisible();

  await page.locator('.svg-inline--fa.fa-reply').click();
  await page.locator('#tiptapcontent').getByRole('textbox').fill('reply test msg Hello Test 123');
  await page.locator('.ant-btn.css-n1j8ju.ant-btn-text.ant-btn-color-default.ant-btn-variant-text.ant-btn-icon-only.sendMessageButton').click();
});
import { test, expect } from '@playwright/test';

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

test('Generated Test Case', async ({ page }) => {
  await page.goto('https://angular.io/');
  const element = await page.getByRole('link',{ name : 'Docs', exact : true});
  await page.keyboard.down('Control'); 
  await element.click();
  await page.keyboard.up('Control'); 
});
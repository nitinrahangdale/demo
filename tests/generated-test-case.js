const { test, expect, chromium } = require('@playwright/test');

    test('Generated Test Case', async () => {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('https://angular.io/');
      const element = await page.getByRole('link',{ name : 'Docs', exact : true});

      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        element.click({ button: 'middle' }) // 'middle' button opens in new tab
    ]); can perform further actions on the new page if needed

    await browser.close();
    });
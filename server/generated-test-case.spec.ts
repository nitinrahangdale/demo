const { test, expect, chromium } = require('@playwright/test');

    test('Generated Test Case', async () => {
      test.slow();
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('https://angular.io/');
      await page.waitForTimeout(3000);
      const element = await page.getByRole('link',{ name : 'Docs', exact : true});

      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        element.focus(),
        element.click({ button: 'middle' })
    ]); 

    await browser.close();
    });
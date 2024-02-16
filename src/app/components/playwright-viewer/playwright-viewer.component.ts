import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReportService } from '../../ngServices/reportService';

@Component({
  selector: 'app-playwright-viewer',
  templateUrl: './playwright-viewer.component.html',
  styleUrl: './playwright-viewer.component.scss'
})
export class PlaywrightViewerComponent {
  public showHtml = false;
  pageUrl: string = '';
  locatorType: string = '';
  locatorSubType: string = '';
  locatorToSearch: string = '';
  action: string = '';
  generatedElement: string = '';
  generatedTestCase: string = '';
  testCaseRunning: boolean = false;
  testCaseResult: string|null = null;

  ariaRoles: string[] = [
    'button',
    'checkbox',
    'combobox',
    'dialog',
    'grid',
    'link',
    'listbox',
    'menu',
    'progressbar',
    'radio',
    'scrollbar',
    'searchbox',
    'slider',
    'spinbutton',
    'switch',
    'tab',
    'textbox',
    'tree',
    'treeitem'
  ];

  constructor(private http: HttpClient, private reportService: ReportService) { }

  public toggleHtml() {
    this.showHtml = !this.showHtml;
  }


  generateTestCase() {
    // Validate inputs
    if (!this.pageUrl || !this.locatorType || !this.action) {
      this.generatedTestCase = 'Please fill all inputs.';
      return;
    }
    switch (this.locatorType) {
      case 'getByRole':
        this.generatedElement = `await page.getByRole('${this.locatorSubType}',{ name : '${this.locatorToSearch}', exact : true})`;
        break;
      case 'getByLabelText':
        this.generatedElement = `await page.getByLabelText('${this.locatorToSearch}')`;
        break;
      case 'getByText':
        this.generatedElement = `await page.getByText('${this.locatorToSearch}')`;
        break;
      case 'getByPlaceholderText':
        this.generatedElement = `await page.getByPlaceholderText('${this.locatorToSearch}')`;
        break;
      default:
        this.generatedElement = 'Invalid locator method.';
    }


    // Generate test case based on inputs
    this.generatedTestCase = `const { test, expect, chromium } = require('@playwright/test');

    test('Generated Test Case', async () => {
      test.slow();
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('${this.pageUrl}');
      await page.waitForTimeout(3000);
      const element = ${this.generatedElement};

      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        element.focus(),
        element.${this.action}({ button: 'middle' })
    ]); 

    await browser.close();
    });`;
  }


  runTests(testCase: string) {
    this.testCaseRunning = true;
    this.reportService.executeTest(testCase).subscribe((res)=>{
      this.testCaseResult = res;
      this.testCaseRunning = false;
  });;
  }
}

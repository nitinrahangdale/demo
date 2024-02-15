import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReportService } from '../../ngServices/reportService';

@Component({
  selector: 'app-html-viewer',
  templateUrl: './html-viewer.component.html',
  styleUrl: './html-viewer.component.scss'
})
export class HtmlViewerComponent {
  reportData = null;

  constructor(private http: HttpClient, private reportService : ReportService) { }

  ngOnInit(): void {
    // this.htmlFilePath = 'C:\Users\NitinRahangdale\Codes\Angular\demo\playwright-report\index.html';
    // console.log(this.htmlFilePath);
  }

  loadReport() {
    this.reportService.getReport()
      .then(data => {
        this.reportData = data;
      })
      .catch(error => {
        console.error('Error loading report:', error);
      });
  }

  saveReport() {
    // Assuming reportData is available in the component
    this.reportService.saveReport(this.reportData)
      .then(() => {
        console.log('Report saved successfully');
      })
      .catch(error => {
        console.error('Error saving report:', error);
      });
  }
}


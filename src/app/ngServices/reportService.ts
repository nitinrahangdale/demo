import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  saveReport(reportData: any): Promise<any> {
    return this.http.post<any>('/save-report', { reportData }).toPromise();
  }

  getReport(): Promise<any> {
    return this.http.get<any>('/get-report').toPromise();
  }

  executeTest(testCase: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { testCase: testCase };
    return this.http.post<any>('http://localhost:3000/runtest', body, { headers: headers });
  }
}
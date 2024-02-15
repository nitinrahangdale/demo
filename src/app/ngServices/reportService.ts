import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = environment.production ? 'https://nitin-playwrightonui--codingdev.netlify.app/.netlify/functions/server/prod' : 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  saveReport(reportData: any): Promise<any> {
    return this.http.post<any>(this.baseUrl +'/save-report', { reportData }).toPromise();
  }

  getReport(): Promise<any> {
    return this.http.get<any>(this.baseUrl +'/get-report').toPromise();
  }

  executeTest(testCase: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { testCase: testCase };
    console.log(environment);
    
    return this.http.post<any>(this.baseUrl + '/runtest', body, { headers: headers });
  }
}
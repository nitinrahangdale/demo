import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }
  
  executeTest(testCase: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { testCase: testCase };
    return this.http.post<any>(this.baseUrl + '/run', body, { headers: headers });
  }
}
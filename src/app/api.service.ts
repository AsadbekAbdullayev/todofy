import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://book-shop-swart.vercel.app';
  constructor(private http: HttpClient) {}
  public task_data: Array<any> = [];
  public loading: boolean = false;
  getData(): Observable<any> {
    const url = `${this.apiUrl}/books`; // Append the path to the base URL
    return this.http.get<any>(url); // Return the Observable from the GET request
  }
  postData(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${endpoint}`, data);
  }
  putData(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${endpoint}`, data);
  }
  deleteData(endpoint: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${endpoint}`);
  }
}

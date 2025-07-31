import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getUserProfile(customerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/${customerId}`);
  }

  updateUserProfile(customerId: string, userDetails: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/${customerId}`, userDetails);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private currentAdminSubject: BehaviorSubject<any>;
  public currentAdmin: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentAdminSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentAdmin') || 'null'));
    this.currentAdmin = this.currentAdminSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  signup(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  adminLogin(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, credentials).pipe(
      tap(admin => {
        localStorage.setItem('currentAdmin', JSON.stringify(admin));
        this.currentAdminSubject.next(admin);
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  
  adminLogout() {
    localStorage.removeItem('currentAdmin');
    this.currentAdminSubject.next(null);
  }

  // *** NEW METHOD TO UPDATE USER DATA LOCALLY ***
  updateCurrentUser(updatedDetails: any) {
    const currentUser = this.currentUserValue;
    // Merge the updated details with the existing user data
    const newUser = { ...currentUser, ...updatedDetails };
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    this.currentUserSubject.next(newUser);
  }
}

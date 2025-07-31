import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart';
  private orderApiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }

  addToCart(userId: number, productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { userId, productId });
  }

  increaseQuantity(itemId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/item/${itemId}/increase`, {});
  }

  decreaseQuantity(itemId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/item/${itemId}/decrease`, {});
  }

  removeFromCart(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/item/${itemId}`);
  }

  checkout(userId: number): Observable<any> {
    return this.http.post(`${this.orderApiUrl}/checkout/${userId}`, {});
  }
}

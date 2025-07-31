import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { CommonModule } from '@angular/common';
import { switchMap,catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { of } from 'rxjs';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  order: any;
  userName: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get the current user's name for the greeting message
    this.authService.currentUser.subscribe(user => {
        if (user) {
            this.userName = user.name;
        }
    });

    // *** THIS IS THE FIX ***
    // This reactive approach listens for any change in the URL's 'id' parameter.
    // It will now correctly re-fetch data even when navigating from one invoice to another.
    this.route.paramMap.pipe(
      switchMap(params => {
        this.order = null; // Reset order state on new navigation
        this.errorMessage = ''; // Reset error message
        const orderId = params.get('id');
        if (orderId) {
          // Fetch the new invoice and handle any potential errors.
          return this.orderService.getInvoice(+orderId).pipe(
            catchError(err => {
              console.error('Failed to fetch invoice:', err);
              this.errorMessage = 'Could not load your order details. Please try again later.';
              return of(null); // Return null on error to stop the loading spinner
            })
          );
        }
        return of(null); // Return null if there's no orderId in the URL
      })
    ).subscribe(data => {
      this.order = data;
    });
  }
}

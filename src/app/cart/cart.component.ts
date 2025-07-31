import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;
  userId: number | null = null;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.loadCart();
      }
    });
  }

  loadCart() {
    if (!this.userId) return;
    this.cartService.getCart(this.userId).subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  increaseQuantity(itemId: number) {
    this.errorMessage = '';
    this.cartService.increaseQuantity(itemId).subscribe({
      next: () => this.loadCart(),
      error: (err) => {
        if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'An unknown error occurred while increasing quantity.';
        }
      }
    });
  }

  decreaseQuantity(itemId: number) {
    this.errorMessage = '';
    this.cartService.decreaseQuantity(itemId).subscribe({
        next: () => this.loadCart(),
        error: () => {
            this.errorMessage = 'An error occurred. Refreshing cart.';
            this.loadCart();
        }
    });
  }

  removeItem(itemId: number) {
    this.errorMessage = '';
    this.cartService.removeFromCart(itemId).subscribe(() => this.loadCart());
  }

  checkout() {
    if (!this.userId) return;
    this.errorMessage = '';
    this.cartService.checkout(this.userId).subscribe({
      next: (order) => {
        // *** THIS IS THE FIX ***
        // A standard navigation now works because the InvoiceComponent is properly reactive.
        this.router.navigate(['/invoice', order.id]);
      },
      error: (err) => {
        if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Checkout failed. Please try again.';
        }
      }
    });
  }
}
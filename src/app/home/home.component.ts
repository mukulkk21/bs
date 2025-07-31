import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  userId: number | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });

    this.authService.currentUser.subscribe(user => {
      this.userId = user ? user.id : null;
    });
  }

  addToCart(productId: number) {
    if (!this.userId) {
      alert('Please log in to add items to your cart.');
      return;
    }
    this.cartService.addToCart(this.userId, productId).subscribe({
      next: () => alert('Product added to cart!'),
      error: (err) => alert(err.error) // Display stock error from backend
    });
  }
}
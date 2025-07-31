import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ProductService } from '../services/product.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  products: any[] = [];
  productForm: FormGroup;
  isEditing = false;
  currentProductId: number | null = null;
  errorMessage = '';

  constructor(
    private adminService: AdminService,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadProducts();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe(data => this.users = data);
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => this.products = data);
  }

  onProductSubmit() {
    if (!this.productForm.valid) return;
    
    this.errorMessage = '';
    const productData = this.productForm.value;

    const apiCall = this.isEditing && this.currentProductId
      ? this.adminService.updateProduct(this.currentProductId, productData)
      : this.adminService.addProduct(productData);

    apiCall.subscribe({
      next: () => {
        this.resetForm();
        this.loadProducts();
      },
      error: (err) => {
        // *** FIXED ERROR HANDLING ***
        if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'An unknown error occurred. Please check the product details and try again.';
        }
      }
    });
  }

  editProduct(product: any) {
    this.isEditing = true;
    this.currentProductId = product.id;
    this.productForm.patchValue(product);
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }

  resetForm() {
    this.isEditing = false;
    this.currentProductId = null;
    this.productForm.reset();
    this.errorMessage = '';
  }
}
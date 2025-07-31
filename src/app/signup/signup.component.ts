import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage = '';
  
  registrationSuccess = false;
  newCustomerId = '';
  newUserName = '';
  newUserEmail='' ; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: (response) => {
          this.registrationSuccess = true;
          this.newCustomerId = response.customerId;
          this.newUserName = response.name;
          this.newUserEmail= response.email ; 
        },
        error: (err) => {
          if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'An unknown error occurred during signup.';
          }
        }
      });
    }
  }
}

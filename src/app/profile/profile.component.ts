import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: any;
  editMode = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.userService.getUserProfile(this.currentUser.customerId).subscribe(profile => {
        this.currentUser = profile;
        this.profileForm.patchValue(this.currentUser);
      });
    }
  }

  toggleEditMode(enable: boolean) {
    this.editMode = enable;
    if (!enable) {
      // If canceling, reset form to original values
      this.profileForm.patchValue(this.currentUser);
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  onSubmit() {
    if (!this.profileForm.valid) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.userService.updateUserProfile(this.currentUser.customerId, this.profileForm.value).subscribe({
      next: (updatedUser) => {
        this.currentUser = updatedUser;
        this.authService.updateCurrentUser(updatedUser); // Update local storage and navbar
        this.successMessage = 'Profile updated successfully!';
        this.editMode = false;
      },
      error: (err) => {
        this.errorMessage = typeof err.error === 'string' ? err.error : 'Failed to update profile.';
      }
    });
  }
}

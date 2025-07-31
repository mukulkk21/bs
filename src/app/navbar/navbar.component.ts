import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink,RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  userName = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) this.userName = user.name;
    });

    this.authService.currentAdmin.subscribe(admin => {
        this.isAdmin = !!admin;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  adminLogout() {
    this.authService.adminLogout();
    this.router.navigate(['/admin/login']);
  }
}
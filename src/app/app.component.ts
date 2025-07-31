
import { NavbarComponent } from "./navbar/navbar.component";
import { Router, NavigationEnd,RouterOutlet  } from '@angular/router';

import { Component, OnDestroy } from '@angular/core';

import { CommonModule } from '@angular/common'; // ✅ this is needed for *ngIf
import { filter, Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent,RouterOutlet], // ✅ add CommonModule here
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
  showNavbar = true;
  private sub: Subscription;

  constructor(private router: Router) {
    this.sub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showNavbar = event.urlAfterRedirects === '/';
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

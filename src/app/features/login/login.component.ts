import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	standalone: true,
    imports: [CommonModule, FormsModule],
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      alert('Enter email and password');
      return;
    }

    const isAdmin = this.email === 'goutampsingh@gmail.com' && this.password === 'admin123';

    localStorage.setItem('futura_user', JSON.stringify({
      email: this.email,
      role: isAdmin ? 'admin' : 'user'
    }));

    this.router.navigate(['/dashboard']);
  }

  requestAccess() {
    alert('Your request has been submitted (mock). Admin will review.');
  }
}

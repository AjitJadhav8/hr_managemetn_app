import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule,FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  name: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const loginData = { name: this.name, password: this.password };

    this.http.post<any>('http://localhost:3000/api/login', loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        localStorage.setItem('loggedInHR', response.user.name); // Save logged-in HR name to localStorage
        localStorage.setItem('loggedInHRId', response.user.u_id); // Save logged-in HR ID to localStorage

        // Redirect based on user name
        if (this.name === 'Sushil') {
          this.router.navigate(['/ceo']); // Redirect to CEO component
        } else {
          this.router.navigate(['/hr-dashboard']); // Redirect to HR dashboard for other users
        }
      },
      error: (error) => {
        this.errorMessage = 'Invalid username or password';
        console.error('Login failed:', error);
      }
    });
  }
}
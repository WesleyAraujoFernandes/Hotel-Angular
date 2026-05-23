import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private apiService: ApiService, private router: Router) {}
  formData: any = {
    email: '',
    password: '',
  };
  error: any = null;

  async handleSubmit() {
    if (!this.formData.email || !this.formData.password) {
      this.showError('Please fill in all fields');
      return;
    }
    this.apiService.loginUser(this.formData).subscribe({
      next: (res) => {
        this.apiService.encryptAndSaveToStorage('token', res.token);
        this.apiService.encryptAndSaveToStorage('role', res.role);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.showError(err?.error?.message || 'Unable to login: '+err?.message || ' An error occurred');
      }
    });
  }

  showError(msg: string) {
    this.error = msg;
    setTimeout(() => {
      this.error = null;
    }, 4000);
  }
}

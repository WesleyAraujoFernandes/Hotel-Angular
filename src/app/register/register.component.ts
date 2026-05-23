import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private apiService: ApiService, private router: Router) { }
  formData: any = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  }

  error: any = null;

  handleSubmit() {
    if (
      !this.formData.firstName ||
      !this.formData.lastName ||
      !this.formData.email ||
      !this.formData.phoneNumber ||
      !this.formData.password
    ) {
      this.showError('Please fill in all fields.');
      return;
    }
    this.apiService.registerUser(this.formData).subscribe({
      next: (res: any) => {
        this.router.navigate(['/login'])
      },
      error: (err: any) => {
        this.showError(err?.error?.message || err.message || 'Registration failed. Please try again:'+err);
      }
    })
  }

  showError(msg: string) {
    this.error = msg;
    setTimeout(() => {
      this.error = null;
    }, 3000);
  }
}

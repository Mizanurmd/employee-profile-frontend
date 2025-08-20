import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { MatButtonModule } from '@angular/material/button';

import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthServiceService } from '../../service/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,

    ReactiveFormsModule,
    NgIf,
    MatButtonModule,

    RouterModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    // Initialize the login form with validators
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // ========== Method to openSnackBar start==========
  openSnackBar(
    message: string,
    action: string = 'Close',
    duration: number = 3000,
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    verticalPosition: MatSnackBarVerticalPosition = 'top'
  ) {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
    });
  }

  //===============openSnackBar end===========
  onLogin(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: (response) => {
          this.openSnackBar('Login is successfully', 'OK');
          console.table(response);
          if (response.role === 'ADMIN') {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/home']);
          }
          // Successful login handled within AuthService (redirecting to appropriate dashboard)
        },
        error: (error) => {
          this.openSnackBar(
            'Something is wrong.......',
            'give correcet username and password'
          );
          console.error('Login failed', error);
          this.errorMessage =
            'Login failed: ' + (error.error.message || 'Unauthorized');
        },
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }

  // Optionally, you can reset the error message on form changes
  onFormChanges(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = null;
    });
  }

  // Trigger the form change listener on component initialization
  ngOnInit(): void {
    this.onFormChanges();
  }
}

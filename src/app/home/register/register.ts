import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

import { Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AuthServiceService } from '../../service/auth-service.service';
import { MatIconModule } from '@angular/material/icon';
import { emailExistsValidator } from '../../validations/email';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    ReactiveFormsModule,
    NgIf,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatDialogModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registrationForm: FormGroup;
  roles = ['USER', 'ADMIN'];

  constructor(
    private fb: FormBuilder,
    private authServ: AuthServiceService,
    private router: Router,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.registrationForm = this.fb.group({
      username: [
        '',

        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
        [emailExistsValidator(this.authServ)],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
        ],
      ],
      role: ['USER', Validators.required], // Default role set to 'USER'
    });
  }

  //============= name validators funtion =============

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
  // ========== Method to openSnackBar end==========

  onSubmit(): void {
    const emailControl = this.registrationForm.get('email');

    if (this.registrationForm.invalid || emailControl?.pending) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const user = this.registrationForm.value;

    this.authServ.register(user).subscribe({
      next: (response: any) => {
        // If backend returned duplicate email in JSON body
        if (response.statusCode === 409) {
          this.openSnackBar('Email is already in use', 'OK');
          return;
        }

        // Success case
        if (response.statusCode === 200) {
          this.openSnackBar('User registered successfully', 'OK');
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        this.openSnackBar('Something went wrong', 'Try again');
        console.error('Error registering user', error);
      },
    });
  }
}

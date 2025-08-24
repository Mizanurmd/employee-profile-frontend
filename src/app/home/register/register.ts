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
import { usernameValidator } from '../../model/user';
import { MatIconModule } from '@angular/material/icon';

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
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      username: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
          asyncValidators: [usernameValidator(this.authServ)],
          updateOn: 'blur', // Validate on blur
        },
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
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
    if (this.registrationForm.valid) {
      const user = this.registrationForm.value;
      this.authServ.register(user).subscribe({
        next: (response) => {
          this.openSnackBar('User registered successfully', 'OK');
          console.log('User registration is successfully', response);
          // Navigate to a different route or show a success message
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.openSnackBar('Something is wrong.........', 'Try again');
          console.error('Error registering user', error);
        },
      });
    } else {
      this.openSnackBar('Registration is not successfull', 'Try again');
      this.router.navigate(['/register']);
    }
  }
}

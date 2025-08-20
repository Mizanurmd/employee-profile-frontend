import { Component, Inject, OnInit } from '@angular/core';
import { Employee } from '../../model/employee';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeService } from '../../service/employee-service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.css'],
})
export class EmployeeForm implements OnInit {
  errorText: string = '';
  employeeForm!: FormGroup;
  imagePreview: string | null = null;

  educationOptions: string[] = [
    'SSC',
    'HSC',
    'Diploma',
    'Bachelor',
    'Masters',
    'PhD',
  ];
  skillOptions: string[] = ['Communication', 'Leadership', 'IT', 'Teaching'];

  constructor(
    private fb: FormBuilder,
    private empServ: EmployeeService,
    private router: Router,
    private matDialRef: MatDialogRef<EmployeeForm>,
    @Inject(MAT_DIALOG_DATA) public data: Employee | null,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nid: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      presentAddress: [''],
      permanentAddress: [''],
      gender: ['', Validators.required],
      skills: [[]],
      highestEducation: ['', Validators.required],
      profileImage: [null],
    });

    // If editing existing employee
    if (this.data) {
      this.employeeForm.patchValue({
        ...this.data,
        dateOfBirth: new Date(this.data.dateOfBirth),
      });

      // Set preview if image exists
      if (this.data.profileImage) {
        this.imagePreview = this.getImageFromBytes(this.data.profileImage);
      }
    }
  }

  onSkillChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const skill = input.value;
    const currentSkills = this.employeeForm.get('skills')?.value || [];

    if (input.checked) {
      if (!currentSkills.includes(skill)) currentSkills.push(skill);
    } else {
      const index = currentSkills.indexOf(skill);
      if (index > -1) currentSkills.splice(index, 1);
    }

    this.employeeForm.get('skills')?.setValue(currentSkills);
  }

  // Convert byte[] or base64 string to data URL
  getImageFromBytes(bytes: number[] | string | null | undefined): string {
    if (!bytes) return '';

    if (typeof bytes === 'string') {
      return 'data:image/png;base64,' + bytes;
    }

    // It's a number array
    const binary = (bytes as number[])
      .map((b) => String.fromCharCode(b))
      .join('');
    return 'data:image/png;base64,' + btoa(binary);
  }

  // Handle new file input
  onProfileImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.employeeForm.patchValue({ profileImage: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openSnackBar(
    message: string,
    action: string = 'Close',
    duration: number = 5000,
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    verticalPosition: MatSnackBarVerticalPosition = 'top'
  ) {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition,
      verticalPosition,
    });
  }

  submitForm(): void {
    if (this.employeeForm.valid) {
      const employee: Employee = this.employeeForm.value;

      if (this.data) {
        // Update employee
        this.empServ.updateEmployee(this.data.id, employee).subscribe({
          next: () => {
            this.openSnackBar('Employee updated successfully.', 'OK');
            this.matDialRef.close(true);
          },
          error: (err) => console.error('Update Error:', err),
        });
      } else {
        // Create employee
        this.empServ.createEmployee(employee).subscribe({
          next: () => {
            this.openSnackBar('Employee added successfully.', 'OK');
            this.matDialRef.close(true);
          },
          error: (err) => console.error('Create Error:', err),
        });
      }
    } else {
      console.error('Form Invalid');
    }
  }

  // close modal
  onNoClick(): void {
    this.matDialRef.close();
  }
}

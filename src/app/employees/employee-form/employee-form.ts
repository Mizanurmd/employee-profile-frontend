import { Component, Inject, OnInit } from '@angular/core';
import { Employee } from '../../model/employee';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
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
  skillOptions: string[] = ['Communication', 'IT', 'Leadership', 'Teaching'];

  constructor(
    private fb: FormBuilder,
    private empServ: EmployeeService,
    private router: Router,
    private matDialRef: MatDialogRef<EmployeeForm>,
    @Inject(MAT_DIALOG_DATA) public data: Employee | null,
    private snackBar: MatSnackBar
  ) {}

  pastDateValidator(control: FormControl) {
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ignore time
    if (inputDate >= today) {
      return { futureDate: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ],
      ],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ],
      ],
      nid: ['', [Validators.required, Validators.pattern(/^\d{10}$|^\d{17}$/)]],
      dateOfBirth: ['', [Validators.required, this.pastDateValidator]],
      presentAddress: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ],
      ],
      permanentAddress: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ],
      ],
      gender: ['', Validators.required],
      skills: [[]],
      highestEducation: ['', Validators.required],
      profileImage: [null],
    });

    // Only patch form if editing (data has an ID)
    if (this.data && this.data.id) {
      const { dateOfBirth, ...rest } = this.data;
      this.employeeForm.patchValue({
        ...rest,
        dateOfBirth: new Date(dateOfBirth),
      });

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

  getImageFromBytes(bytes: number[] | string | null | undefined): string {
    if (!bytes) return '';
    if (typeof bytes === 'string') return 'data:image/png;base64,' + bytes;
    const binary = (bytes as number[])
      .map((b) => String.fromCharCode(b))
      .join('');
    return 'data:image/png;base64,' + btoa(binary);
  }

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
    if (!this.employeeForm.valid) {
      this.openSnackBar(
        'Form is invalid. Please fill all required fields correctly.',
        'OK'
      );
      return;
    }

    // Get raw form data (including disabled id)
    const employee: any = this.employeeForm.getRawValue();

    if (this.data && this.data.id) {
      // UPDATE
      const employee: any = this.employeeForm.getRawValue();
      this.empServ.updateEmployee(this.data.id, employee).subscribe({
        next: (updatedEmployee) => {
          this.openSnackBar(
            `Employee updated successfully. ID: ${updatedEmployee.id}`,
            'OK'
          );
          this.matDialRef.close(true);
        },
        error: (err) => {
          console.error('Update Error:', err);
          this.openSnackBar('Failed to update employee.', 'OK');
        },
      });
    } else {
      // CREATE new employee
      delete employee.id; // ensure ID is not sent
      this.empServ.createEmployee(employee).subscribe({
        next: (createdEmployee) => {
          this.employeeForm.patchValue({ id: createdEmployee.id });
          this.openSnackBar(
            `Employee added successfully. ID: ${createdEmployee.id}`,
            'OK'
          );
          this.matDialRef.close(true);
        },
        error: (err) => {
          console.error('Create Error:', err);
          this.openSnackBar('Failed to add employee.', 'OK');
        },
      });
    }
  }

  onNoClick(): void {
    this.matDialRef.close();
  }
}

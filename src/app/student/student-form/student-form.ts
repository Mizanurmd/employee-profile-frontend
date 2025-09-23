import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StudentService } from '../student-service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-student-form',
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    FormsModule,
    MatIconModule,
    NgFor,
    NgIf,
  ],
  templateUrl: './student-form.html',
  styleUrl: './student-form.css',
})
export class StudentForm implements OnInit {
  student!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  constructor(
    private matDiologRef: MatDialogRef<StudentForm>,
    private studentServ: StudentService,
    private fb: FormBuilder,
    private snakBar: MatSnackBar,
    private matDialogRef: MatDialogRef<StudentForm>
  ) {}
  selectedClass: String[] = [
    'CLASS_1',
    'CLASS_2',
    'CLASS_3',
    'CLASS_4',
    'CLASS_5',
    'CLASS_6',
    'CLASS_7',
    'CLASS_8',
    'CLASS_9',
    'CLASS_10',
    'HSC_SCIENCE',
    'HSC_COMMERCE',
    'HSC_ARTS',
  ];

  selectedSection: String[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
  ];

  // Open toast
  openSnackBar(
    message: string,
    action: string = 'Close',
    duration: number = 3000,
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    verticalPosition: MatSnackBarVerticalPosition = 'top'
  ) {
    this.snakBar.open(message, action, {
      duration,
      horizontalPosition,
      verticalPosition,
    });
  }

  ngOnInit(): void {
    this.student = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      fatherName: ['', [Validators.required]],
      motherName: ['', [Validators.required]],
      admissionNumber: [''],
      dateOfBirth: ['', Validators.required],
      gender: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      section: ['', [Validators.maxLength(50)]],
      studentClass: [''],
      admissionDate: ['', Validators.required],
      rollNumber: ['', [Validators.maxLength(50)]],
      addresses: this.fb.array([]),
      profileImagePath: [''],
    });
    // Start with 1 empty address row
    this.addAddress();
  }

  // Get addresses form array
  get addresses(): FormArray {
    return this.student.get('addresses') as FormArray;
  }

  // Create one address form group
  private createAddress(): FormGroup {
    return this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: [''],
      presentAddress: [''],
      permanentAddress: [''],
    });
  }
  // Add new address row
  addAddress(): void {
    this.addresses.push(this.createAddress());
  }

  // Remove address row
  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }

  // file seletec
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }
  //save student
  onSave(): void {
    if (this.student.invalid) {
      this.openSnackBar('Please fill all required fields.', 'Ok');
      return;
    }

    const studentPayload = { ...this.student.value };

    // Format dates
    if (studentPayload.dateOfBirth) {
      const dob = new Date(studentPayload.dateOfBirth);
      studentPayload.dateOfBirth = dob.toLocaleDateString('en-GB');
    }
    if (studentPayload.admissionDate) {
      const ad = new Date(studentPayload.admissionDate);
      studentPayload.admissionDate = ad.toLocaleDateString('en-GB');
    }

    const formData = new FormData();
    formData.append('studentDto', JSON.stringify(studentPayload));

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.studentServ.saveStudent(formData).subscribe({
      next: (response) => {
        this.openSnackBar('New Student added successfully.', 'Ok');
        this.matDialogRef.close(response);
      },
      error: (err) => {
        console.error('Error saving student:', err);
        this.openSnackBar('New Student add failed.', 'Ok');
      },
    });
  }

  // Cancel
  onClick(): void {
    this.matDiologRef.close();
  }

  //Save Student
}

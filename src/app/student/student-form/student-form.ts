import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
import { StudentDto } from '../student';

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
    private matDialogRef: MatDialogRef<StudentForm>,
    @Inject(MAT_DIALOG_DATA) public studentData: StudentDto | null
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
    // Create the form
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

    // Add Student case → start with 1 empty address row
    if (!this.studentData) {
      this.addAddress();
    }

    // Update Student case
    if (this.studentData) {
      this.student.patchValue({
        firstName: this.studentData.firstName,
        lastName: this.studentData.lastName,
        fatherName: this.studentData.fatherName,
        motherName: this.studentData.motherName,
        admissionNumber: this.studentData.admissionNumber,
        dateOfBirth: this.studentData.dateOfBirth
          ? new Date(this.studentData.dateOfBirth)
          : '',
        gender: this.studentData.gender,
        email: this.studentData.email,
        phoneNumber: this.studentData.phoneNumber,
        studentClass: this.studentData.studentClass,
        admissionDate: this.studentData.admissionDate
          ? new Date(this.studentData.admissionDate)
          : '',
        section: this.studentData.section,
        rollNumber: this.studentData.rollNumber,
      });

      // Populate addresses
      const addressFormArray = this.student.get('addresses') as FormArray;
      addressFormArray.clear();

      if (this.studentData.addresses?.length > 0) {
        this.studentData.addresses.forEach((addr) => {
          addressFormArray.push(this.createAddress(addr)); // 👈 simplified
        });
      } else {
        this.addAddress();
      }

      // Show existing image preview
      if (this.studentData.profileImagePath) {
        this.imagePreview = `http://localhost:8081${this.studentData.profileImagePath}`;
      }
    }
  }

  // Get addresses form array
  get addresses(): FormArray {
    return this.student.get('addresses') as FormArray;
  }

  // Create one address form group
  private createAddress(addr?: any): FormGroup {
    return this.fb.group({
      addressId: [addr?.addressId || null],
      street: [addr?.street || '', Validators.required],
      city: [addr?.city || '', Validators.required],
      state: [addr?.state || ''],
      presentAddress: [addr?.presentAddress || ''],
      permanentAddress: [addr?.permanentAddress || ''],
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

    // Convert dates to ISO format for backend
    if (studentPayload.dateOfBirth) {
      studentPayload.dateOfBirth = new Date(studentPayload.dateOfBirth).toLocaleDateString('en-GB');
    }
    if (studentPayload.admissionDate) {
      studentPayload.admissionDate = new Date(studentPayload.admissionDate).toLocaleDateString('en-GB');
    }

    const formData = new FormData();
    formData.append('studentDto', JSON.stringify(studentPayload));

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    if (this.studentData && this.studentData.id != null) {
      // Update student
      this.studentServ.updateStudent(this.studentData.id, formData).subscribe({
        next: response => {
          this.openSnackBar('Student updated successfully.', 'Ok');
          this.matDialogRef.close(response);
        },
        error: err => {
          console.error('Error updating student:', err);
          this.openSnackBar('Student update failed.', 'Ok');
        }
      });
    } else {
      // Add new student
      this.studentServ.saveStudent(formData).subscribe({
        next: response => {
          this.openSnackBar('New Student added successfully.', 'Ok');
          this.matDialogRef.close(response);
        },
        error: err => {
          console.error('Error saving student:', err);
          this.openSnackBar('New Student add failed.', 'Ok');
        }
      });
    }
  }

  // Cancel
  onCancel(): void {
    this.matDiologRef.close();
  }

  //Save Student
}

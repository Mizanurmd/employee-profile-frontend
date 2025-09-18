import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import {
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
import { TeacherService } from '../teacher-service';
import { Gender, Teacher } from '../teacher';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-teacher-form',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    NgFor,
    NgIf,
    MatDatepickerModule,
  ],
  templateUrl: './teacher-form.html',
  styleUrl: './teacher-form.css',
})
export class TeacherForm implements OnInit {
  protected readonly value = signal('');
  teacher!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  constructor(
    private matDialogRef: MatDialogRef<TeacherForm>,
    private teacherServ: TeacherService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Teacher | null,
    private snakBar: MatSnackBar
  ) {}

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }
  //Skills
  skillList: string[] = [
    'IT',
    'Teaching',
    'Leading',
    'Accounting',
    'Merketing',
    'Communication',
    'Java',
    'CSS',
    'Python',
    'Javascript',
    'Node JS',
    'HTML',
    'Bootstrap',
    'PHP',
    'C++',
    'C',
    'C#',
    'VUE',
    'Angular',
    'React',
    'Other',
  ];

  //Education list
  educationList: string[] = [
    'SSC',
    'HSC',
    'BA',
    'BSc',
    'MSc',
    'BBA',
    'BBS',
    'MBA',
    'Honours',
    'Degree (Pass) Course',
    'LLB',
    'PHD',
    'MBBS',
    'MS',
    'MSS',
    'BCom',
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

  // Teacher
  ngOnInit(): void {
    this.teacher = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      gender: ['', Validators.required],
      skills: [[]],
      highestEducation: [''],
      mobile: ['', [Validators.required, Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      nid: ['', [Validators.required, Validators.maxLength(17)]],
      dateOfBirth: ['', [Validators.required]],
      presentAddress: [''],
      permanentAddress: [''],
      profileImagePath: [''],
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file; // store the actual file
      this.teacher.patchValue({ profileImagePath: file.name }); // optional, just show name
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onSave(): void {
    if (this.teacher.invalid) {
      alert('Please fill all required fields.');
      return;
    }

    // If image upload is required, use FormData
    const formData = new FormData();
    Object.entries(this.teacher.value).forEach(([key, value]) => {
      if (key === 'dateOfBirth' && value) {
        const dob = new Date(value as string | number | Date);
        const formattedDob = dob.toLocaleDateString('en-GB'); // dd/MM/yyyy
        formData.append('dateOfBirth', formattedDob);
      } else if (key !== 'profileImagePath') {
        // append all other form fields
        if (value !== null && value !== undefined) {
          formData.append(key, value as any);
        }
      }
    });

    // Append the actual file with **backend parameter name 'file'**
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.teacherServ.saveTeacher(formData).subscribe({
      next: (response) => {
        this.openSnackBar('New Teacher added successfully.', 'Ok');
        this.matDialogRef.close(response);
      },
      error: (err) => {
        console.error('Error saving teacher:', err);
        this.openSnackBar('New Teacher added failed.', 'Ok');
      },
    });
  }

  // close Add Teacher form
  onNoClick(): void {
    this.matDialogRef.close();
  }
}

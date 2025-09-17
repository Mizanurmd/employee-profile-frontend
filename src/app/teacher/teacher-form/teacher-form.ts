import { NgFor } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
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
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TeacherService } from '../teacher-service';
import { Gender, Teacher } from '../teacher';

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
    MatDatepickerModule,
  ],
  templateUrl: './teacher-form.html',
  styleUrl: './teacher-form.css',
})
export class TeacherForm implements OnInit {
  protected readonly value = signal('');
  teacher!: FormGroup;
  selectedFile: File | null = null;
  constructor(
    private matDialogRef: MatDialogRef<TeacherForm>,
    private teacherServ: TeacherService,
    private fb: FormBuilder
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
      dateOfBirth: [''],
      presentAddress: [''],
      permanentAddress: [''],
      profileImagePath: [''],
    });
  }

  onSave(): void {
    if (this.teacher.invalid) {
      alert('Please fill all required fields.');
      return;
    }

    // If image upload is required, use FormData
    const formData = new FormData();
    Object.entries(this.teacher.value).forEach(([key, value]) => {
      if (key === 'profileImagePath' && this.selectedFile) {
        formData.append('profileImage', this.selectedFile);
      } else {
        formData.append(key, value as any);
      }
    });

    this.teacherServ.saveTeacher(formData).subscribe({
      next: (response) => {
        console.log('Teacher saved:', response);
        alert('Teacher saved successfully!');
        this.matDialogRef.close(response);
      },
      error: (err) => {
        console.error('Error saving teacher:', err);
        alert('Failed to save teacher!');
      },
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.teacher.patchValue({ profileImagePath: file });
      this.teacher.get('profileImagePath')?.updateValueAndValidity();
    }
  }

  // close Add Teacher form
  onNoClick(): void {
    this.matDialogRef.close();
  }
}

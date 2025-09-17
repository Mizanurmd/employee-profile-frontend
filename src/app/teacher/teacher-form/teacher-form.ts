import { NgFor } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
export class TeacherForm {
  protected readonly value = signal('');
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

  constructor(private matDialogRef: MatDialogRef<TeacherForm>) {}

  // close Add Teacher form
  onNoClick(): void {
    this.matDialogRef.close();
  }
}

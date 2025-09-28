import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CourseService } from '../course-service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { StudentDto } from '../../student/student';


@Component({
  selector: 'app-course-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './course-form.html',
  styleUrl: './course-form.css',
})
export class CourseForm implements OnInit {
  courseForm!: FormGroup;
  students : StudentDto[] =[];
  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<CourseForm>,
    private courseServ: CourseService,
    private snakBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { students: StudentDto[] } | null
    
  ) {}

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
    this.courseForm = this.fb.group({
      courseName: ['', [Validators.required]],
      courseDescription: [''],
      studentId: [''],
    });
 // Load students as observable
  this.students = this.data?.students ?? [];

  }

  // save course
  onSave() {
    if (this.courseForm.invalid) {
      this.openSnackBar('Please fill required fields.', 'Ok');
      return;
    }
    this.courseServ.createCourses(this.courseForm.value).subscribe({
      next: (response) => {
        this.openSnackBar('New course added successfully.', 'Ok');
        this.ref.close(response);
      },
      error: (err) => {
        console.error('Error saving course:', err);
        this.openSnackBar('New course add failed.', 'Ok');
      },
    });
  }

  //Cancel
  onCancel(): void {
    this.ref.close();
  }
}

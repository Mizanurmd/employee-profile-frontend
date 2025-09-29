import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Course } from '../course';
import { CourseService } from '../course-service';
import { MatDialog } from '@angular/material/dialog';
import { CourseForm } from '../course-form/course-form';
import { MatButtonModule } from '@angular/material/button';
import { DialogModal } from '../../employees/dialog-modal/dialog-modal';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { StudentDto } from '../../student/student';
import { StudentService } from '../../student/student-service';

@Component({
  selector: 'app-course-list',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList implements OnInit {
  courses: Course[] = [];
  displayedColumns: string[] = [
    'courseId',
    'courseName',
    'courseDescription',
    'actions',
  ];
  dataSource = new MatTableDataSource<Course>([]);
  students: StudentDto[] = [];
  page: number = 0;
  size: number = 5;
  sortBy: string = 'id';
  sortDir: string = 'asc';
  constructor(
    private courseServ: CourseService,
    private matDialog: MatDialog,
    private snakBar: MatSnackBar,
    private studentServ: StudentService
  ) {}

  ngOnInit(): void {
    // Load Course
    this.loadAllCourse();

    // Load students
    this.loadAllStudent();
  }

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

  // Add course Modal form
  openAddCourseForm() {
    const matDiologRef = this.matDialog.open(CourseForm, {
      width: '650px',
      height: '350px',
      data: { students: this.students },
    });
    matDiologRef.afterClosed().subscribe((res) => {
      if (res === true) this.loadAllCourse();
    });
  }

  // Edit course Modal form
  openEditCourseForm() {
    const matDiologRef = this.matDialog.open(CourseForm, {
      width: '650px',
      height: '350px',
    });
    matDiologRef.afterClosed().subscribe((res) => {
      if (res === true) this.loadAllCourse();
    });
  }

  // Get all students
  loadAllStudent() {
    this.studentServ
      .getAllStudents(this.page, this.size, this.sortBy, this.sortDir)
      .subscribe({
        next: (data) => {
          this.students = data.students;
          console.log('Student data :: ', data.students);
        },
        error: (err) => {
          console.log('Something is wrong :: ', err);
        },
      });
  }

  // get ALl Coursees

  loadAllCourse() {
    this.courseServ.getAllCourses().subscribe({
      next: (res) => {
        this.courses = res.data;
        this.dataSource.data = res.data;
        console.log('Course data :: ', res.data);
      },
      error: (err) => {
        console.error('Something went wrong :: ', err);
      },
    });
  }

  // Delete coures Modal
  deleteCourse(id: number): void {
    const dialogRef = this.matDialog.open(DialogModal, {
      width: '350px',
      data: { entityName: 'Course' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.courseServ.deleteCourse(id).subscribe({
          next: () => {
            this.loadAllCourse(),
              this.openSnackBar('Course Deleted succesfully.', 'Ok');
          },
          error: (err) => {
            console.error('Error deleting course:', err),
              this.openSnackBar('Course Deleted failed.', 'Ok');
          },
        });
      }
    });
  }
}

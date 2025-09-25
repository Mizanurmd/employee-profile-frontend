import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../student-service';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StudentDto } from '../student';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule} from '@angular/common';
import { AddressDto } from '../address';
import { MatDialog } from '@angular/material/dialog';
import { StudentForm } from '../student-form/student-form';
import { FormsModule } from '@angular/forms';
import { DialogModal } from '../../employees/dialog-modal/dialog-modal';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ViewStudent } from '../view-student/view-student';
import { ImageView } from '../../teacher/image-view/image-view';

@Component({
  selector: 'app-student-list',
  imports: [
    MatIconModule,
    MatTableModule,
    RouterModule,
    MatButtonModule,
    MatPaginatorModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList implements OnInit {
  students: StudentDto[] = [];
  studentViewById: StudentDto | null = null;
  displayedColumns: String[] = [
    'studentId',
    'rollNumber',
    'name',
    'fatherName',
    'motherName',
    'admissionNumber',
    'dateOfBirth',
    'class',
    'admissionDate',
    'section',
    'gender',
    'email',
    'mobile',
    'presentAddress',
    'permanentAddress',
    'city',
    'profileImagePath',
    'actions',
  ];
  dataSource = new MatTableDataSource<StudentDto>([]);
  page: number = 0;
  size: number = 5;
  sortBy: string = 'id';
  sortDir: string = 'asc';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private studentServ: StudentService,
    private matDialog: MatDialog,
    private snakBar: MatSnackBar
  ) {}

  ngOnInit(): void {
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

  // Addresses
  getAddressField(addresses: AddressDto[], field: keyof AddressDto): string {
    if (!addresses || addresses.length === 0) return '';
    const value = addresses[0][field];
    return value !== undefined && value !== null ? value.toString() : '';
  }

  // Get all students
  loadAllStudent() {
    this.studentServ
      .getAllStudents(this.page, this.size, this.sortBy, this.sortDir)
      .subscribe({
        next: (data) => {
          this.students = data.students;
          this.dataSource.data = data.students;
          console.log('Student data :: ', data.students);
        },
        error: (err) => {
          console.log('Something is wrong :: ', err);
        },
      });
  }

  // Open Add Student Form Modal
  openAddStudentForm() {
    const dialogRef = this.matDialog.open(StudentForm, {
      width: '750px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res === true) {
        this.loadAllStudent();
      }
    });
  }

  // Open dialog and update Student
  updateStudnetData(studentData: StudentDto) {
    const dialogRef = this.matDialog.open(StudentForm, {
      width: '750px',
      height: '600px',
      data: studentData, // pass current teacher
    });

    dialogRef.afterClosed().subscribe((formData: FormData | null) => {
      if (formData && studentData.id != null) {
        this.studentServ.updateStudent(studentData.id, formData).subscribe({
          next: () => this.loadAllStudent(),
          error: (err) => console.error('Error updating teacher:', err),
        });
      }
    });
  }

  deleteModal(id: number): void {
    const dialogRef = this.matDialog.open(DialogModal, {
      width: '350px',
      data: { entityName: 'Student' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.studentServ.deleteStudent(id).subscribe({
          next: () => {
            this.loadAllStudent(),
              this.openSnackBar('Student Deleted succesfully.', 'Ok');
          },
          error: (err) => {
            console.error('Error deleting teacher:', err),
              this.openSnackBar('Student Deleted failed.', 'Ok');
          },
        });
      }
    });
  }

  // Get Student by id
  getStudentById(id: number): void {
    this.studentServ.studentById(id).subscribe({
      next: (response) => {
        this.studentViewById = response.data;
        console.log('Get Student by Id :: ', this.studentViewById);
        this.openStudentView(this.studentViewById);
      },
      error: (err) => {
        console.error('Error fetching student:', err);
      },
    });
  }

  // Open Student View page
  openStudentView(student: StudentDto) {
    const dialogRef = this.matDialog.open(ViewStudent, {
      data: student,
      width: '850px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadAllStudent();
      }
    });
  }

  // Only Image view
  openOnlyImageView(element: any) {
    const dialogRef = this.matDialog.open(ImageView, {
      data: {
        imageUrl: 'http://localhost:8081' + element.profileImagePath,
      },
      width: '600px',
      height: '500px',
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadAllStudent();
      }
    });
  }
}

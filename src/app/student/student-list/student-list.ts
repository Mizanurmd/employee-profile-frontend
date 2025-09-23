import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../student-service';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StudentDto } from '../student';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NgFor, NgIf } from '@angular/common';
import { AddressDto } from '../address';
import { MatDialog } from '@angular/material/dialog';
import { StudentForm } from '../student-form/student-form';

@Component({
  selector: 'app-student-list',
  imports: [
    MatIconModule,
    MatTableModule,
    RouterModule,
    MatButtonModule,
    MatPaginatorModule,
    NgIf,
  ],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList implements OnInit {
  students: StudentDto[] = [];
  displayedColumns: String[] = [
    'studentId',
    'rollNumber',
    'name',
    'fatherName',
    'motherName',
    'admissionNumber',
    'dateOfBirth',
    'gender',
    'email',
    'mobile',
    'addresses',
    'class',
    'admissionDate',
    'section',
    'profileImagePath',
    'actions',
  ];
  dataSource = new MatTableDataSource<StudentDto>([]);
  page: number = 0;
  size: number = 10;
  sortBy: string = 'id';
  sortDir: string = 'asc';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private studentServ: StudentService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAllStudent();
  }
  // Addresses
  getAddressString(addresses: AddressDto[]): string {
    if (!addresses || addresses.length === 0) return '';
    return addresses
      .map((addr) => `${addr.street}, ${addr.city}, ${addr.state}`)
      .join(' || ');
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
}

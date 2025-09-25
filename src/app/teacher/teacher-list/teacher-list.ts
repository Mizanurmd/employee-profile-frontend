import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TeacherService } from '../teacher-service';
import { Teacher } from '../teacher';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TeacherForm } from '../teacher-form/teacher-form';
import { NgIf } from '@angular/common';
import { TeacherView } from '../teacher-view/teacher-view';
import { ImageView } from '../image-view/image-view';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { DialogModal } from '../../employees/dialog-modal/dialog-modal';

@Component({
  selector: 'app-teacher-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    NgIf,
  ],
  templateUrl: './teacher-list.html',
  styleUrl: './teacher-list.css',
})
export class TeacherList implements OnInit, AfterViewInit {
  teachers: Teacher[] = [];
  teacherById: Teacher | null = null;
  displayedColumns: string[] = [
    'teacherId',
    'name',
    'gender',
    'skills',
    'highestEducation',
    'mobile',
    'email',
    'nid',
    'dateOfBirth',
    'presentAddress',
    'permanentAddress',
    'profileImagePath',
    'actions',
  ];
  dataSource = new MatTableDataSource<Teacher>([]);

  page: number = 0;
  size: number = 10;
  sortBy: string = 'id';
  sortDir: string = 'asc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private teacherServ: TeacherService,
    private router: Router,
    private matDialog: MatDialog,
    private snakBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAllTeacher();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

  // load all teahcer data
  loadAllTeacher() {
    this.teacherServ
      .getAllTeacher(this.page, this.size, this.sortBy, this.sortDir)
      .subscribe({
        next: (data) => {
          this.teachers = data.teachers;
          this.dataSource.data = data.teachers;
          console.log('Teacher data :: ', data.teachers);
        },
        error: (err) => {
          console.error('Error loading teachers:', err);
        },
      });
  }

  // Open Add teacher form modal
  openTeacherAddForm() {
    const dialogRef = this.matDialog.open(TeacherForm, {
      width: '750px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) this.loadAllTeacher();
    });
  }

  // Get Teahcer by id
  getTeacherById(id: number) {
    this.teacherServ.teacherById(id).subscribe({
      next: (response) => {
        this.teacherById = response;
        console.log('Get Teacher by Id :: ', this.teacherById);
        //Open dialog after fetching data
        this.openTeacherView(this.teacherById);
      },
      error: (err) => {
        console.error('Error fetching teacher:', err);
      },
    });
  }
  // Open Teacher View page
  openTeacherView(teacher: Teacher) {
    const dialogRef = this.matDialog.open(TeacherView, {
      data: this.teacherById,
       width: '850px',
      height: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadAllTeacher();
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
        this.loadAllTeacher();
      }
    });
  }

  // Delete Teacher By id
  deleteTeacherById(id: number): void {
    const dialogRef = this.matDialog.open(DialogModal, {
      width: '350px',
      data: { entityName: 'Teacher' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teacherServ.deleteTeacherId(id).subscribe({
          next: () => this.loadAllTeacher(),
          error: (err) => console.error('Error deleting teacher:', err),
        });
      }
    });
  }

  sofeDeleteTeacher(teacherId: string): void {
    const dialogRef = this.matDialog.open(DialogModal, {
      width: '350px',
      data: { entityName: 'Teacher' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teacherServ.softDeleteTeacherById(teacherId).subscribe({
          next: () => this.loadAllTeacher(),
          error: (err) => console.error('Error deleting teacher:', err),
        });
      }
    });
  }

 
  // Open dialog and update teacher
updateTeacherData(teacherData: Teacher) {
  const dialogRef = this.matDialog.open(TeacherForm, {
    width: '750px',
    height: '600px',
    data: teacherData, // pass current teacher
  });

  dialogRef.afterClosed().subscribe((formData: FormData | null) => {
    if (formData && teacherData.id != null) {
      this.teacherServ.updateTeacher(teacherData.id, formData).subscribe({
        next: () => this.loadAllTeacher(),
        error: (err) => console.error('Error updating teacher:', err),
      });
    }
  });
}

}

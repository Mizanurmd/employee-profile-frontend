import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EmployeeForm } from '../../employees/employee-form/employee-form';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../service/auth-service.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { EmployeeList } from '../../employees/employee-list/employee-list';
import { TeacherList } from '../../teacher/teacher-list/teacher-list';
import { StudentList } from '../../student/student-list/student-list';
import { Dashboard } from '../../dashboard/dashboard';
import { CourseList } from "../../courses/course-list/course-list";




@Component({
  selector: 'app-home',
  imports: [
    MatToolbarModule,
    RouterModule,
    CommonModule,

],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
   email!:string;
selectedEntity: 'teacher' | 'student' | 'employee' | 'course' | null = null;


  showEntity(entity: 'teacher' | 'student' | 'employee' | 'course') {
    this.selectedEntity = entity;
  }

  role: string | null = null;
  constructor(
    private matDialog: MatDialog,
    private authServ: AuthServiceService,
    private snackBar: MatSnackBar,
     private router: Router,
  ) {}

  ngOnInit(): void {
    this.role = this.authServ.getRole();
   this.email = history.state?.email;

    if (!this.email) {
      this.email = localStorage.getItem('email') || '';
    }
    console.log('Email in Home:', this.email);

  }

  isExpanded: boolean = false;
  // toggle menu
  toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }

  openEmployeeForm(): void {
    const dialogRef = this.matDialog.open(EmployeeForm);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Handle after close if needed
      }
    });
  }

  openSnackBar(
    message: string,
    action: string = 'Close',
    duration: number = 3000,
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    verticalPosition: MatSnackBarVerticalPosition = 'top'
  ) {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
    });
  }

  //logout method
  logout(): void {
    this.authServ.logout();
    this.openSnackBar('logout Successfully');
  }
}

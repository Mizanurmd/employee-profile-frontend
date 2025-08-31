import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EmployeeList } from '../../employees/employee-list/employee-list';
import { EmployeeForm } from '../../employees/employee-form/employee-form';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AuthServiceService } from '../../service/auth-service.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MatToolbarModule, EmployeeList, RouterModule, NgIf],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  role: string | null = null;
  constructor(
    private matDialog: MatDialog,
    private authServ: AuthServiceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.role = this.authServ.getRole();
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

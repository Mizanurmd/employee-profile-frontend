import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EmployeeList } from '../../employees/employee-list/employee-list';
import { EmployeeForm } from '../../employees/employee-form/employee-form';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AuthServiceService } from '../../service/auth-service.service';

@Component({
  selector: 'app-home',
  imports: [MatToolbarModule, EmployeeList, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor(
    private matDialog: MatDialog,
    private authServ: AuthServiceService 

  ) {}

  ngOnInit(): void {}

  openEmployeeForm(): void {
    const dialogRef = this.matDialog.open(EmployeeForm);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Handle after close if needed
      }
    });
  }

  logout(): void {
    this.authServ.logout();
  }
}

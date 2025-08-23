import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { EmployeeService } from '../../service/employee-service';
import { Employee } from '../../model/employee';
import { EmployeeForm } from '../employee-form/employee-form';
import { DialogModal } from '../dialog-modal/dialog-modal';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginator,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css'],
})
export class EmployeeList implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'mobile',
    'email',
    'nid',
    'dateOfBirth',
    'presentAddress',
    'permanentAddress',
    'gender',
    'skills',
    'highestEducation',
    'profileImage',
    'action',
  ];

  dataSource = new MatTableDataSource<Employee>([]);
  totalItems = 0;
  pageSize = 5;
  currentPage = 0;
  sortBy = 'id';
  sortDir = 'asc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private empService: EmployeeService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe((event: PageEvent) => {
      this.currentPage = event.pageIndex;
      this.pageSize = event.pageSize;
      this.loadEmployees();
    });
  }

  // Open Form for Create or Edit
  openEmployeeForm(employee?: Employee): void {
    const dialogRef = this.matDialog.open(EmployeeForm, {
      width: '700px',
      data: employee || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadEmployees();
      }
    });
  }

  // Convert base64 / bytes to image
  getImageFromBytes(bytes: any): string {
    if (!bytes) return '';
    return typeof bytes === 'string' ? `data:image/png;base64,${bytes}` : '';
  }

  // Load Employees
  loadEmployees(): void {
    this.empService
      .getEmployees(this.currentPage, this.pageSize, this.sortBy, this.sortDir)
      .subscribe({
        next: (res) => {
          this.dataSource.data = res.employees.map((emp: any) => ({
            ...emp,
            skills:
              typeof emp.skills === 'string'
                ? JSON.parse(emp.skills)
                : emp.skills,
          }));
          this.totalItems = res.totalItems;
        },
        error: (err) => console.error('Error fetching employees:', err),
      });
  }

  // Delete Employee
  deleteEmployee(emp: Employee): void {
    const dialogRef = this.matDialog.open(DialogModal, {
      width: '350px',
      data: emp,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.empService.deleteEmployee(emp.id).subscribe({
          next: () => this.loadEmployees(),
          error: (err) => console.error('Error deleting employee:', err),
        });
      }
    });
  }

   // Report all employees function
getAllEmployeesReport(format: string) {
  this.empService.allEmployeesReport(format).subscribe({
    next: (data: Blob) => {
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(file);
      window.open(fileURL); // opens in new tab
    },
    error: (err) => {
      console.error('Error downloading report:', err);
    }
  });
}

// Get report by id
getEmployeeReportById(id: string, format: string) {
  this.empService.employeeReportById(id, format).subscribe({
    next: (data: Blob) => {
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(file);
      window.open(fileURL); 
    },
    error: (err) => {
      console.error('Error downloading employee report:', err);
    }
  });
}





}

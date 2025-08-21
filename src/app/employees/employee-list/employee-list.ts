import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private empService: EmployeeService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
    return typeof bytes === 'string'
      ? `data:image/png;base64,${bytes}`
      : '';
  }

  // Load Employees
  loadEmployees(): void {
    this.empService.getEmployees().subscribe({
      next: (res) => {
        this.dataSource.data = res.map((emp) => ({
          ...emp,
          skills:
            typeof emp.skills === 'string'
              ? JSON.parse(emp.skills)
              : emp.skills,
        }));
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
}

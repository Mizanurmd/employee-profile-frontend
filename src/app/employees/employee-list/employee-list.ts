import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../service/employee-service';
import { Employee } from '../../model/employee';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeForm } from '../employee-form/employee-form';
import { DialogModal } from '../dialog-modal/dialog-modal';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
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

  getImageFromBytes(bytes: any): string {
    if (!bytes) return '';

    // If it's already a base64 string
    if (typeof bytes === 'string') {
      return 'data:image/png;base64,' + bytes;
    }

    // If it's a typed array or number[]
    let byteArray: Uint8Array;
    if (bytes instanceof ArrayBuffer) {
      byteArray = new Uint8Array(bytes);
    } else if (Array.isArray(bytes)) {
      byteArray = new Uint8Array(bytes);
    } else {
      return '';
    }

    let binary = '';
    for (let i = 0; i < byteArray.length; i++) {
      binary += String.fromCharCode(byteArray[i]);
    }

    return 'data:image/png;base64,' + btoa(binary);
  }

  loadEmployees(): void {
    this.empService.getEmployees().subscribe({
      next: (res) => {
        const employees = res.map((emp) => ({
          ...emp,
          skills:
            typeof emp.skills === 'string'
              ? JSON.parse(emp.skills)
              : emp.skills,
        }));
        this.dataSource.data = employees;
        this.dataSource._updateChangeSubscription();
      },
      error: (err) => console.error('Error fetching employees:', err),
    });
  }

  // Edit Handler method
  editEmployee(emp: Employee) {
    const dialogRef = this.matDialog.open(EmployeeForm, {
      width: '700px',
      data: emp,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  //delete method
  deleteEmployee(emp: Employee) {
    const dialogRef = this.matDialog.open(DialogModal, {
      width: '350px',
      data: emp,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.empService.deleteEmployee(emp.id).subscribe({
          next: () => {
            console.log('Deleted:', emp);
            this.loadEmployees(); // refresh list
          },
          error: (err) => {
            console.error('Error deleting employee:', err);
          },
        });
      }
    });
  }
}

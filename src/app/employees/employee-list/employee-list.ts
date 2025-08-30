import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { EmployeeService } from '../../service/employee-service';
import { Employee } from '../../model/employee';
import { EmployeeForm } from '../employee-form/employee-form';
import { DialogModal } from '../dialog-modal/dialog-modal';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginator,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
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

  searchForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private empService: EmployeeService,
    private matDialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      mobile: [''],
      email: [''],
      subject: [''],
    });
  }

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

  loadEmployees(): void {
    this.search();
    //live search
    this.searchForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 0;
        this.search();
      });
  }

  search(): void {
    const { name, mobile, email, subject } = this.searchForm.value;
    // If all fields empty, send empty string
    const keyword = [name, mobile, email, subject]
      .filter((v) => v && v.trim() !== '')
      .join(' ');

    this.empService
      .searchEmployees(
        name,
        mobile,
        email,
        subject,
        this.currentPage,
        this.pageSize
      )
      .subscribe({
        next: (res) => {
          this.dataSource.data = res.content.map((emp: any) => ({
            ...emp,
            skills:
              typeof emp.skills === 'string'
                ? JSON.parse(emp.skills)
                : emp.skills,
          }));
          this.totalItems = res.totalElements;
        },
        error: (err) => console.error('Error fetching employees:', err),
      });
  }

  // page change
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.search();
  }

  //open add from
  openEmployeeForm(employee?: Employee): void {
    const dialogRef = this.matDialog.open(EmployeeForm, {
      width: '700px',
      data: employee || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) this.loadEmployees();
    });
  }

  //delete
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

  //image
  getImageFromBytes(bytes: any): string {
    if (!bytes) return '';
    return typeof bytes === 'string' ? `data:image/png;base64,${bytes}` : '';
  }

  // get all employees report
  getAllEmployeesReport(format: string): void {
    this.empService.allEmployeesReport(format).subscribe({
      next: (data: Blob) => {
        const file = new Blob([data], { type: 'application/pdf' });
        const fileURL = window.URL.createObjectURL(file);
        window.open(fileURL);
      },
      error: (err) => console.error('Error downloading report:', err),
    });
  }

  // single employee report
  getEmployeeReportById(id: string, format: string): void {
    this.empService.employeeReportById(id, format).subscribe({
      next: (data: Blob) => {
        const file = new Blob([data], { type: 'application/pdf' });
        const fileURL = window.URL.createObjectURL(file);
        window.open(fileURL);
      },
      error: (err) => console.error('Error downloading employee report:', err),
    });
  }
}

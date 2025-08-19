import { Component } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table'

@Component({
  selector: 'app-employee-list',
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList implements AfterViewInit{
  displayedColumns: string[] = ['name', 'mobile', 'email', 'nid', 'dateOfBirth','presentAddress','permanentAddress','gender','skills','highestEducation','profileImage', 'action'];
  dataSource = new MatTableDataSource<''>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

}

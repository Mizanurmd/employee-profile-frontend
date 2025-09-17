import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TeacherService } from '../teacher-service';
import { Teacher } from '../teacher';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-teacher-list',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './teacher-list.html',
  styleUrl: './teacher-list.css',
})
export class TeacherList implements OnInit, AfterViewInit {
  teachers: Teacher[] = [];
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
    'actions',
  ];
  dataSource = new MatTableDataSource<Teacher>([]);

  page: number = 0;
  size: number = 10;
  sortBy: string = 'id';
  sortDir: string = 'asc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private teacherServ: TeacherService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllTeacher();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

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
}

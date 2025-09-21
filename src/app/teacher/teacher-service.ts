import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, throwError } from 'rxjs';
import { Teacher, TeacherPage } from './teacher';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private baseURl = 'http://localhost:8081/api/v1/teachers';

  constructor(private http: HttpClient) {}

  //get all teacher api
  getAllTeacher(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string
  ): Observable<TeacherPage> {
    const url = `${this.baseURl}/all`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<TeacherPage>(url, { headers, params });
  }

  //save teacher
  saveTeacher(formData: FormData): Observable<Teacher> {
    const url = `${this.baseURl}/save`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Teacher>(url, formData, { headers });
  }

  //Get Signle teacher
  teacherById(id: number): Observable<Teacher> {
    const url = `${this.baseURl}/${id}`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Teacher>(url, { headers });
  }

  // Delete teacher

  deleteTeacherId(id: number): Observable<Teacher> {
    const url = `${this.baseURl}/${id}`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<Teacher>(url, { headers });
  }

  // Soft delete teahcer
  softDeleteTeacherById(teacherId: string): Observable<Teacher> {
    const url = `${this.baseURl}/soft-delete/${teacherId}`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<Teacher>(url, { headers });
  }
}

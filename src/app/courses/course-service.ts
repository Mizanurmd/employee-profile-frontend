import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from './course';
import { ApiResponse } from '../../apiRespons';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private http: HttpClient) {}
  private baseURl = 'http://localhost:8081/api/v1/courses';

  // get all Course
  getAllCourses(): Observable<ApiResponse<Course[]>> {
    const url = `${this.baseURl}/all`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<Course[]>>(url, { headers });
  }

  // get Single Course Data
  getCourse(id: number): Observable<Course> {
    const url = `${this.baseURl}/${id}`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Course>(url, { headers });
  }

  // get all Course
  createCourses(formData: FormData): Observable<ApiResponse<Course>> {
    const url = `${this.baseURl}/save`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<ApiResponse<Course>>(url, formData, { headers });
  }

  // Update Course
  updateCourses(id: number, formData: FormData): Observable<Course> {
    const url = `${this.baseURl}/update/${id}`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<Course>(url, formData, { headers });
  }

  // get all Course
  deleteCourse(id: number): Observable<ApiResponse<Course>> {
    const url = `${this.baseURl}/${id}`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<ApiResponse<Course>>(url, { headers });
  }
}

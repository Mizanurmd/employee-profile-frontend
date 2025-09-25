import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentDto, StudentPage } from './student';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../apiRespons';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private baseURl = 'http://localhost:8081/api/v1/students';

  constructor(private http: HttpClient) {}

  //get all teacher api
  getAllStudents(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string
  ): Observable<StudentPage> {
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

    return this.http.get<StudentPage>(url, { headers, params });
  }

  // Save student
  saveStudent(formData: FormData): Observable<StudentDto> {
    const url = `${this.baseURl}/save`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<StudentDto>(url, formData, { headers });
  }

  // Delete student
  studentById(id: number): Observable<ApiResponse<StudentDto>> {
    const url = `${this.baseURl}/${id}`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<StudentDto>>(url, { headers });
  }

  // Delete student
  deleteStudent(id: number): Observable<StudentDto> {
    const url = `${this.baseURl}/${id}`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<StudentDto>(url, { headers });
  }
  // update student
  updateStudent(id: number, formData: FormData): Observable<StudentDto> {
    const url = `${this.baseURl}/update/${id}`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<StudentDto>(url, formData, { headers });
  }
}

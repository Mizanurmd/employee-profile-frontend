import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}

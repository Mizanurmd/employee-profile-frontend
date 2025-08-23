import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../model/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8081/api/v1/employees';
  private reportApiUrl = 'http://localhost:8081/api/v1/reports';

  constructor(private http: HttpClient) {}

  // All
  getEmployees(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string
  ): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<any>(this.apiUrl, { headers, params });
  }

  // Single
  getEmployeeById(id: string): Observable<Employee> {
    const url = `${this.apiUrl}/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<Employee>(url, { headers });
  }

  // Create
  createEmployee(employeeData: any): Observable<Employee> {
    const formData = new FormData();
    const url = `${this.apiUrl}/save`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });

    // formData.append('id', employeeData.id);
    formData.append('name', employeeData.name);
    formData.append('mobile', employeeData.mobile);
    formData.append('email', employeeData.email);
    formData.append('nid', employeeData.nid);

    // Convert dateOfBirth to yyyy-MM-dd
    let dob: Date | null = null;
    if (employeeData.dateOfBirth) {
      dob =
        employeeData.dateOfBirth instanceof Date
          ? employeeData.dateOfBirth
          : new Date(employeeData.dateOfBirth);
    }
    const formattedDate = dob ? dob.toISOString().split('T')[0] : '';
    formData.append('dateOfBirth', formattedDate);

    formData.append('presentAddress', employeeData.presentAddress || '');
    formData.append('permanentAddress', employeeData.permanentAddress || '');
    formData.append('gender', employeeData.gender);
    formData.append('highestEducation', employeeData.highestEducation);
    formData.append('skills', JSON.stringify(employeeData.skills));

    if (employeeData.profileImage) {
      formData.append('profileImage', employeeData.profileImage);
    }

    return this.http.post<Employee>(url, formData, { headers });
  }

  // Update
  updateEmployee(id: string, employeeData: any): Observable<Employee> {
    const formData = new FormData();
    const url = `${this.apiUrl}/update/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });

    // Append all fields
    formData.append('id', employeeData.id);
    formData.append('name', employeeData.name);
    formData.append('mobile', employeeData.mobile);
    formData.append('email', employeeData.email);
    formData.append('nid', employeeData.nid);

    // Format date
    const dob =
      employeeData.dateOfBirth instanceof Date
        ? employeeData.dateOfBirth
        : new Date(employeeData.dateOfBirth);
    formData.append('dateOfBirth', dob.toISOString().split('T')[0]);

    formData.append('presentAddress', employeeData.presentAddress || '');
    formData.append('permanentAddress', employeeData.permanentAddress || '');
    formData.append('gender', employeeData.gender);
    formData.append('highestEducation', employeeData.highestEducation);
    formData.append('skills', JSON.stringify(employeeData.skills));

    // Only append profileImage if it's a File object (user changed it)
    if (employeeData.profileImage instanceof File) {
      formData.append('profileImage', employeeData.profileImage);
    }

    return this.http.put<Employee>(url, formData, { headers });
  }

  // Delete
  deleteEmployee(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.delete<void>(url, { headers });
  }

  // Report all employees
  allEmployeesReport(format: string): Observable<Blob> {
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http.get(`${this.reportApiUrl}/${format}`, {
    headers,
    responseType: 'blob' as 'json'  // force blob
  })as Observable<Blob>;
}

// Report single employee by ID
employeeReportById(id: string, format: string): Observable<Blob> {
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http.get(`${this.reportApiUrl}/${id}/${format}`, {
    headers,
    responseType: 'blob' as 'json'
  })as Observable<Blob>;
}



}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../model/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

 private apiUrl = 'http://localhost:8081/api/v1/employees'; 

  constructor(private http: HttpClient) { }

getEmployees(): Observable<Employee[]> {
  return this.http.get<Employee[]>(`${this.apiUrl}/all`);
}

  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

// EmployeeService
createEmployee(employeeData: any): Observable<Employee> {
  const formData = new FormData();

  formData.append('id', employeeData.id);
  formData.append('name', employeeData.name);
  formData.append('mobile', employeeData.mobile);
  formData.append('email', employeeData.email);
  formData.append('nid', employeeData.nid);

  // Convert dateOfBirth to yyyy-MM-dd
  let dob: Date | null = null;
  if (employeeData.dateOfBirth) {
    dob = employeeData.dateOfBirth instanceof Date ? employeeData.dateOfBirth : new Date(employeeData.dateOfBirth);
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

  return this.http.post<Employee>(`${this.apiUrl}/save`, formData);
}



updateEmployee(id: string, employeeData: Employee): Observable<Employee> {
  const formData = new FormData();

  formData.append('id', employeeData.id);
  formData.append('name', employeeData.name);
  formData.append('mobile', employeeData.mobile);
  formData.append('email', employeeData.email);
  formData.append('nid', employeeData.nid);

  // Convert string date to yyyy-MM-dd
  let formattedDate = '';
  if (employeeData.dateOfBirth) {
    const dob = new Date(employeeData.dateOfBirth); 
    formattedDate = dob.toISOString().split('T')[0]; 
  }
  formData.append('dateOfBirth', formattedDate);

  formData.append('presentAddress', employeeData.presentAddress || '');
  formData.append('permanentAddress', employeeData.permanentAddress || '');
  formData.append('gender', employeeData.gender);
  formData.append('highestEducation', employeeData.highestEducation);
  formData.append('skills', JSON.stringify(employeeData.skills));

  if (employeeData.profileImage) {
    formData.append('profileImage', employeeData.profileImage);
  }

  return this.http.put<Employee>(`${this.apiUrl}/update/${id}`, formData);
}



  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgentRegister } from './agent-register/agent-register';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private baseURl = 'http://localhost:8081/api/v1/registrations';

  constructor(private http: HttpClient) {}

  // Get all Agent Register
  getAllAgentRegisters(): Observable<AgentRegister[]> {
    const url = `${this.baseURl}/all`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<AgentRegister[]>(url, { headers });
  }

  saveAgent(formData: FormData): Observable<AgentRegister> {
    const url = `${this.baseURl}/save`;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<AgentRegister>(url, formData, { headers });
  }
}

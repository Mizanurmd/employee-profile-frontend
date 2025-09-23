import { Routes } from '@angular/router';
import { Register } from './home/register/register';
import { Login } from './home/login/login';
import { Home } from './home/home/home';
import { AuthGuardService } from './service/auth.guard.service';
import { TeacherList } from './teacher/teacher-list/teacher-list';
import { StudentList } from './student/student-list/student-list';

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'home', component: Home, canActivate: [AuthGuardService] },
  { path: 'teacher', component: TeacherList, canActivate: [AuthGuardService] },
  { path: 'student', component: StudentList, canActivate: [AuthGuardService] },
  { path: 'logout', redirectTo: '/login' },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

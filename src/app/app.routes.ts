import { Routes } from '@angular/router';
import { Register } from './home/register/register';
import { Login } from './home/login/login';
import { Home } from './home/home/home';

export const routes: Routes = [
  //   { path: 'list', component: EmployeeList},
  // { path: 'login', component: EmployeeForm },
  // { path: 'register', component: Register},
  // { path: 'login', component: Login },
  // { path: '', component: Home},

  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'logout', redirectTo: '/login' },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

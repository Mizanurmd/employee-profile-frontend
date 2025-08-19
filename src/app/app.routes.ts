import { Routes } from '@angular/router';
import { EmployeeList } from './employees/employee-list/employee-list';
import { EmployeeForm } from './employees/employee-form/employee-form';
import { Register } from './home/register/register';
import { Login } from './home/login/login';
import { Home } from './home/home/home';

export const routes: Routes = [
      { path: 'list', component: EmployeeList},
    { path: 'login', component: EmployeeForm },
    { path: 'register', component: Register},
    { path: 'login', component: Login },
    { path: '', component: Home},
    // { path: 'user', component: UserDetailsComponent },
    // { path: 'user-dashboard', component: UserDashboradComponent },
    // { path: 'view-project/:id', component: ProjectViewComponent },
    // { path: 'login', component: LoginComponent },
    // { path: 'logout', redirectTo: '/login' }, 
    // { path: '', redirectTo: '/login', pathMatch: 'full' },
    // { path: '**', redirectTo: '/login' },
   
];

import { Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService:AuthServiceService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole =  route.data['role'];
    const currentRole = this.authService.getAccessToken();

    if (this.authService.isAuthenticated() && currentRole === expectedRole) {
      return true;
    }

    // Navigate to the appropriate dashboard if the user is not authorized
    if (currentRole === 'ADMIN') {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/home']);
    }
    return false;
  }
}

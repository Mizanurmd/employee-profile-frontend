import { Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService:AuthServiceService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
 
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Navigate to the appropriate dashboard if the user is not authorized
   
      this.router.navigate(['/login']);
  
    return false;
  }
}

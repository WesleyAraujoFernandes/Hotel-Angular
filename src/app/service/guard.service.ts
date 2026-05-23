import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { ApiService } from './api.service';
@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(private apiService: ApiService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiresAdmin = route.data['requiresAdmin'] || false;
    if (requiresAdmin) {
      if (this.apiService.isAdmin()) {
        return true; // Authorized as admin, allow access
      } else {
        this.router.navigate(['/login'],{ queryParams: { returnUrl: state.url } });
        return false; // Not authorized, redirect to login
      }
    } else {
      if (this.apiService.isAuthenticated()) {
        return true; // Authenticated, allow access
      } else {
        this.router.navigate(['/login'],{ queryParams: { returnUrl: state.url } });
        return false; // Not authenticated, redirect to login
      }
    }
  }
}

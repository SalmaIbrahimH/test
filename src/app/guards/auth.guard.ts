import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { StateService } from '../services/state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private stateService: StateService) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    // Wait for isLoggedin method to complete
    let isLoggedin = await this.authService.isLoggedin();
    
    if (!isLoggedin) {
      console.log('isLoggedin',isLoggedin)
      this.authService.redirectUrl = state.url;
      this.stateService.isAdmin.next(false);
      this.router.navigate(['auth']);
      return false;
    }

    // If logged in, allow access
    return true;
  }
}


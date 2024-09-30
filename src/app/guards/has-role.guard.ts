import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { StateService } from '../services/state.service';

@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {
  constructor(private authService: AuthService, private stateService: StateService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // const isAuthorized = this.authService.userInfo?.role?.includes(route.data.role);
    const isAdmin = this.stateService.isAdmin.getValue();
    if (route.data['role'] == 'Admin' && !isAdmin) {
      this.router.navigateByUrl('/courses');
      return false;
    }
    if (route.data['role'] == 'User' && isAdmin) {
      this.router.navigateByUrl('/admin');
      return false;
    }
    // return isAuthorized;
    return true;
  }

}

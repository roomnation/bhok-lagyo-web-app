import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService } from '../employee/employee.service';

@Injectable({
  providedIn: 'root'
})
export class AttendGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
    const isHomeRoute = (route.url[0]?.path ?? '') === 'home';
    const canAttend = this.employeeService.getCanAttend$().getValue();
    if (isHomeRoute) {
      if (canAttend) {
        return this.router.createUrlTree(['/attend']);
      } else {
        return true;
      }
    } else {
      if (canAttend) {
        return true;
      } else {
        return this.router.createUrlTree(['/home']);
      }
    }
  }

  constructor(private employeeService: EmployeeService,
    private router: Router) { }
}

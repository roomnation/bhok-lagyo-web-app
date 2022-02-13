import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthRoute = (route.url[0]?.path ?? '') === 'auth';
    const isLoggedIn = !!this.authService.currentUser;
    if (isAuthRoute) {
      if (isLoggedIn) {
        return this.router.createUrlTree(['/home']);
      } else {
        return true;
      }
    } else {
      if (isLoggedIn) {
        return true;
      }
      return this.router.createUrlTree(['/auth'])
    }
  }

  constructor(private authService: AuthService,
    private router: Router) {
  }
}

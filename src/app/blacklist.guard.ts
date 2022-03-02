import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { BlacklistService } from './blacklist.service';

@Injectable({
  providedIn: 'root'
})
export class BlacklistGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isRektRoute = (route.url[0]?.path ?? '') === 'rekt';
    return this.blacklistService.isBlackListed$()
      .pipe(take(1),
        map((isBlackListed) => {
          if (isBlackListed) {
            if (isRektRoute) {
              return true;
            } else {
              return this.router.createUrlTree(['/rekt']);
            }
          } else {
            if (isRektRoute) {
              return this.router.createUrlTree(['/home']);
            } else {
              return true;
            }
          }
        }
        )
      )
  }

  constructor(private blacklistService: BlacklistService,
    private router: Router) { }

}

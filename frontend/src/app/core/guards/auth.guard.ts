import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ERoutes } from '../../shared/utils/routes.enum';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Promise<boolean | UrlTree> {
    return this.checkAuth();
  }

  canActivateChild(): Observable<boolean | UrlTree> {
    return from(this.checkAuth());
  }

  private async checkAuth(): Promise<boolean | UrlTree> {
    try {
      const data = this.authService.loginData;
      if (!data?.accessToken) {
        return this.saveRedirectAndLogout();
      }

      return true;
    } catch (error) {
      return this.saveRedirectAndLogout();
    }
  }

  private saveRedirectAndLogout() {
    const currentUrl = this.router.url.split('?')[0];
    const route = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
    const params = this.router.routerState.snapshot.root.queryParams;

    if (route !== ERoutes.LOGIN && currentUrl !== '/') {
      this.authService.routeRedirect = { url: currentUrl, params };
    } else {
      this.authService.routeRedirect = null;
    }

    this.authService.logout();
    return this.router.createUrlTree([ERoutes.LOGIN]);
  }
}

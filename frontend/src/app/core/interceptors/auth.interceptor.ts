import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('assets/')) {
      return next.handle(req);
    }

    const data = this.authService.loginData;

    if (data?.accessToken) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${data.accessToken}` },
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}

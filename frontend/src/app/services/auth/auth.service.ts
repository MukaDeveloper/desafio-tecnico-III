import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { IPatientLoginResponse } from './interfaces/patient-login-response.interface';
import { IEnvelopeData } from '../../shared/models/envelope-data.model';
import { HttpService } from '../../core/api/http.service';
import { HttpContext } from '../../shared/models/http-context.model';
import { HttpContextEnum } from '../../shared/models/enums/http-context-method.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public routeRedirect: { url: string; params?: Record<string, string> } | null = null;
  private loggedIn$ = new BehaviorSubject<boolean>(false);
  private tokenKey = 'auth_token';

  constructor(private readonly httpService: HttpService) {
    this.loggedIn$.next(!!localStorage.getItem(this.tokenKey));
  }
  public get loginData(): IPatientLoginResponse | null {
    try {
      const storage = localStorage.getItem(this.tokenKey);

      if (storage) {
        const object: IPatientLoginResponse = JSON.parse(storage);

        const expiresAt = new Date(object.expiresAt);
        if (expiresAt.getTime() < new Date().getTime() + 1000 * 60 * 10) {
          localStorage.removeItem(this.tokenKey);
          return null;
        }

        return object;
      }

      return null;
    } catch (error) {
      return null;
    }
  }
  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn$.next(false);
  }

  public login(email: string, password: string): Observable<IEnvelopeData<IPatientLoginResponse>> {
    const context: HttpContext = {
      method: HttpContextEnum.POST,
      url: 'auth/login',
      headers: { 'Content-Type': 'application/json' },
      body: { email, password },
    };

    return this.httpService.send<IEnvelopeData<IPatientLoginResponse>>(context).pipe(
      tap((res) => {
        if (res.statusCode === 200 && res.data) {
          const data = res.data;
          data.expiresAt = new Date(new Date().getTime() + data.expiresIn * 1000).toISOString();
          localStorage.setItem(this.tokenKey, JSON.stringify(data) ?? '');
          this.loggedIn$.next(true);
        }
      }),
      map((res) => res)
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { HttpContext } from '../../shared/models/http-context.model';
import { HttpContextEnum } from '../../shared/models/enums/http-context-method.enum';
import { environment } from '../../../environments/environment';
import { HttpErrorHandler } from '../../shared/utils/http-error-handler';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  protected baseUrl = `${environment.apiUrl}`;

  constructor(private readonly http: HttpClient) {}

  public send<T>(context: HttpContext): Observable<T> {
    const handlers: Record<HttpContextEnum, (ctx: HttpContext) => Observable<T>> = {
      GET: (ctx) => this.get<T>(ctx),
      POST: (ctx) => this.post<T>(ctx),
      PATCH: (ctx) => this.patch<T>(ctx),
      PUT: (ctx) => this.put<T>(ctx),
      DELETE: (ctx) => this.delete<T>(ctx),
    };

    const handler = handlers[context.method];
    if (!handler) {
      throw new Error(`HTTP method não suportado: ${context.method}`);
    }

    return handler(context).pipe(catchError(HttpErrorHandler.handle));
  }

  private get<T>(context: HttpContext): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${context.url}`, {
      headers: context.headers || {},
      params: context.params || {},
      timeout: Number.parseInt(environment.HTTP_TIMEOUT || '30000'),
    });
  }

  private post<T>(context: HttpContext): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${context.url}`, context.body ?? {}, {
      headers: context.headers || {},
      params: context.params || {},
      timeout: Number.parseInt(environment.HTTP_TIMEOUT || '30000'),
    });
  }

  private patch<T>(context: HttpContext): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${context.url}`, context.body ?? {}, {
      headers: context.headers || {},
      params: context.params || {},
      timeout: Number.parseInt(environment.HTTP_TIMEOUT || '30000'),
    });
  }

  private put<T>(context: HttpContext): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${context.url}`, context.body ?? {}, {
      headers: context.headers || {},
      params: context.params || {},
      timeout: Number.parseInt(environment.HTTP_TIMEOUT || '30000'),
    });
  }

  private delete<T>(context: HttpContext): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${context.url}`, {
      headers: context.headers || {},
      params: context.params || {},
      timeout: Number.parseInt(environment.HTTP_TIMEOUT || '30000'),
    });
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { IErrorModel } from '../models/error.model';

export class HttpErrorHandler {
  static handle(error: HttpErrorResponse | any) {
    const parsedError = HttpErrorHandler.parse(error);
    return throwError(() => parsedError);
  }

  private static parse(error: HttpErrorResponse | any): IErrorModel {
    if (error instanceof HttpErrorResponse) {
      return {
        message: error.error?.message || 'Sem conexão',
        status: error.status,
        timestamp: new Date().toISOString(),
        path: error.url || '',
        details: error.error,
      };
    }

    return {
      message: error.message || 'Erro inesperado',
      status: error.status || 0,
      timestamp: new Date().toLocaleString(),
      path: '',
      details: error,
    };
  }
}

import { HttpContextEnum } from './enums/http-context-method.enum';

export interface HttpContext {
  method: HttpContextEnum;
  url: string;
  headers?: Record<string, any>;
  params?: Record<string, any>;
  body?: any;
}

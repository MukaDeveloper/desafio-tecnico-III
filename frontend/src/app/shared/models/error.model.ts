export interface IErrorModel {
  message: string | string[];
  status: number;
  timestamp?: string;
  path?: string;
  details?: any;
}

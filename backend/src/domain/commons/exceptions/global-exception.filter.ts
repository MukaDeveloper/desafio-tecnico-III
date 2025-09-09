import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let stark: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      stark = exception.stack || null;
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const safeResponse = exceptionResponse as {
          message?: string;
          errors?: any;
        };
        message = safeResponse.message || message;
      }
    } else if (exception instanceof Error) {
      stark = exception.stack || null;
      message = exception.message;
    }

    const responseMessage: any = {
      statusCode: status,
      message: message,
      stark: stark,
      url: request.url,
    };

    response.status(status).json(responseMessage);
  }
}

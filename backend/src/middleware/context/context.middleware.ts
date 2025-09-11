// context.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ContextAccess } from './context.access';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    ContextAccess.run(
      {
        user: {
          id: '00000000-0000-0000-0000-000000000000',
          name: 'UnknownPatient',
          type: 'UnknownTypePatient',
          email: '',
        },
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      },
      next,
    );
  }
}

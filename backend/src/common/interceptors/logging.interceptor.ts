import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request, Response } from 'express';

interface MaybeUser { id?: string; role?: string }

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { user?: MaybeUser }>();
    const res = http.getResponse<Response>();
    const { method, originalUrl } = req;
    const start = Date.now();

    const who = req.user?.id
      ? `${req.user.id}(${req.user.role ?? '?'})`
      : 'anon';

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - start;
          this.logger.log(`${method} ${originalUrl} ${res.statusCode} ${ms}ms user=${who}`);
        },
        error: (err: { status?: number; message?: string }) => {
          const ms = Date.now() - start;
          const status = err?.status ?? 500;
          this.logger.warn(
            `${method} ${originalUrl} ${status} ${ms}ms user=${who} error="${err?.message ?? 'unknown'}"`,
          );
        },
      }),
    );
  }
}

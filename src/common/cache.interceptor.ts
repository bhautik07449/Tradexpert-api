import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from '@songkeys/nestjs-redis';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private static redisWarningLogged = false;

  constructor(private readonly redisService: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    if (request.method !== 'GET') {
      return next.handle();
    }
    const key = `cache:${request.originalUrl}`;

    try {
      const client = this.redisService.getClient();
      // Only proceed with caching if the client is ready
      if (client && client.status === 'ready') {
        const cached = await client.get(key);
        if (cached) {
          return of(JSON.parse(cached));
        }
      } else if (!CacheInterceptor.redisWarningLogged) {
        console.warn('CacheInterceptor: Redis client is not ready. Caching is temporarily disabled.');
        CacheInterceptor.redisWarningLogged = true;
      }
    } catch (err) {
      if (!CacheInterceptor.redisWarningLogged) {
        console.warn('CacheInterceptor: Redis is unavailable. Caching is temporarily disabled.', err.message);
        CacheInterceptor.redisWarningLogged = true;
      }
    }

    return next.handle().pipe(
      tap(async (data) => {
        try {
          const client = this.redisService.getClient();
          if (client && client.status === 'ready') {
            await client.set(key, JSON.stringify(data), 'EX', 30);
          }
        } catch (err) {
          // ignore cache set errors silently
        }
      })
    );
  }
}

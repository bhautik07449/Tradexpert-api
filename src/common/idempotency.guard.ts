import { InjectRedis } from '@songkeys/nestjs-redis';
import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { BusinessException } from '../common/business.exception';
import { Constants } from '../common/constants';
import { ErrorCodes } from './error-codes.constant';

@Injectable()
export class IdempotencyGuard implements CanActivate {
    constructor(@InjectRedis() private readonly redis: Redis) { }
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (request.method === 'POST') {
            const url = request.url.replaceAll('/', '_');
            let idempotencyKey = request.headers['idempotency-key']
            if (!idempotencyKey) throw new BusinessException(ErrorCodes.ERR_IN_001, "Missing Required Header: Idempotency-Key", "api", IdempotencyGuard.name);
            const userId = request.user?request.user.userId:'0';
            idempotencyKey = `${url}_${userId}_${idempotencyKey}`;
            return this.redis.set(idempotencyKey, JSON.stringify(true), "EX", Constants.IDEMPOTENCY_KEY_CACHE_TTL, "GET").then((value) => {
                if (value) throw new ConflictException('Duplicate Idempotency-Key, Resubmitted request failed');
                return true;
            });
        }
        return true
    }

}

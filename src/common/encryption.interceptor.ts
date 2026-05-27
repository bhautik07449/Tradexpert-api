import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { encrypt, decrypt } from './encryption.util';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();

    // 1. Handle Incoming Decryption
    if (request.body && typeof request.body === 'object' && 'payload' in request.body) {
      try {
        const decryptedStr = decrypt(request.body.payload);
        request.body = JSON.parse(decryptedStr);
      } catch (err) {
        console.error('EncryptionInterceptor: Decryption failed for request:', err.message);
        // Let it fall through, or optionally throw an exception. Let's keep it robust.
      }
    }

    // 2. Handle Outgoing Encryption
    return next.handle().pipe(
      map((data) => {
        // Skip encryption if data is null, undefined, or explicitly requested not to encrypt
        if (data === null || data === undefined) {
          return data;
        }

        // If request specifies no encryption (e.g. for debugging or raw downloads)
        if (request.headers['x-no-encrypt'] === 'true') {
          return data;
        }

        try {
          const stringified = JSON.stringify(data);
          const encryptedPayload = encrypt(stringified);
          return {
            payload: encryptedPayload,
            encrypted: true,
          };
        } catch (err) {
          console.error('EncryptionInterceptor: Encryption failed for response:', err.message);
          return data;
        }
      })
    );
  }
}

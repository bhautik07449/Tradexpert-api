import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';
import { BusinessException } from './business.exception';
import { ErrorCodes } from './error-codes.constant';

@Catch(BusinessException, QueryFailedError)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessException | QueryFailedError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof QueryFailedError) {
      const driverError = exception.driverError as { code?: string; detail?: string };
      if (driverError?.code === '23505') {
        const isEmailDuplicate = driverError.detail?.includes('(email)');
        response.status(HttpStatus.CONFLICT).json({
          success: false,
          errorCode: ErrorCodes.ERR_RC_002,
          message: isEmailDuplicate
            ? 'Email already exists. Please use a different email address.'
            : 'A record with the same unique value already exists.',
        });
        return;
      }

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        errorCode: ErrorCodes.ERR_EX_001,
        message: 'Internal server error',
      });
      return;
    }

    response.status(
      exception.errorCode === ErrorCodes.ERR_RC_002
        ? HttpStatus.CONFLICT
        : HttpStatus.BAD_REQUEST,
    ).json({
      success: false,
      errorCode: exception.errorCode,
      message: exception.message,
    });
  }
}